import { SlashCommandSubcommandBuilder } from "discord.js";
import { ServerReminderConfig, Unit } from "../../classes/Database/Models";
import { logger } from "../../classes/Logger";
import { GuildChatInputCommandInteraction } from "../../types/ExtendedTypes";
import { confirmPrompt } from "../../userinterface/General/PromiseFunctions";
import { NoConfig } from "../../userinterface/Reminders/Embeds";
import { DefineCancel, DefineError, DefineSuccess, UpdateExistingUnitPrompt } from "../../userinterface/Unit/Embeds";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";

export const data = new SlashCommandSubcommandBuilder()
	.setName("define")
	.setDescription("Define a unit for use with the session reminding. Can also update existing units.")
	.addStringOption(option =>
		option
			.setName("name")
			.setDescription("The unit's name.")
			.setRequired(true))
	.addNumberOption(option =>
		option
			.setName("length")
			.setDescription("The length of time of this unit in seconds.")
			.setRequired(true)
			.setMinValue(0)
			.setMaxValue(Number.MAX_VALUE));

export async function execute(interaction: GuildChatInputCommandInteraction) {
	if(!(await ServerReminderConfig.existsFor(interaction.guildId))) {
		return await interaction.reply({ embeds: [ NoConfig(true) ] });
	}

	await interaction.deferReply();

	const name = interaction.options.getString("name", true);
	const length = interaction.options.getNumber("length", true);

	try {
		const unit = await Unit.findOne({ where: { serverId: interaction.guildId, name: name } });
		if(unit) {
			await interaction.editReply({ embeds: [ UpdateExistingUnitPrompt(name) ] });
			const result = await confirmPrompt(interaction);
			if(result) {
				await unit.update({ length: length });
				await interaction.editReply({ embeds: [ DefineSuccess(unit.name, unit.length) ] });
			} else {
				await interaction.editReply({ embeds: [ DefineCancel() ] });
			}
		} else {
			const newUnit = await Unit.create({
				serverId: interaction.guildId,
				name: name,
				length: length
			});

			await interaction.editReply({ embeds: [ DefineSuccess(newUnit.name, newUnit.length) ] });
		}
	} catch(error) {
		await interaction.editReply({ embeds: [ DefineError() ] });
		logger.error(formatUnwrappedError(unwrapError(error)));
	}
}