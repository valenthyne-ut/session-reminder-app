import { SlashCommandSubcommandBuilder } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../types/ExtendedTypes";
import { ServerReminderConfig, Unit } from "../../classes/Database/Models";
import { NoConfig } from "../../userinterface/Reminders/Embeds";
import { DeleteCancel, DeleteError, DeleteNameNotFound, DeletePrompt, DeleteSuccess } from "../../userinterface/Unit/Embeds";
import { confirmPrompt } from "../../userinterface/General/PromiseFunctions";

export const data = new SlashCommandSubcommandBuilder()
	.setName("delete")
	.setDescription("Delete an existing unit.")
	.addStringOption(option =>
		option
			.setName("name")
			.setDescription("The unit's name.")
			.setRequired(true));

export async function execute(interaction: GuildChatInputCommandInteraction) {
	if(!(await ServerReminderConfig.existsFor(interaction.guildId))) {
		return await interaction.reply({ embeds: [ NoConfig(true) ] });
	}

	await interaction.deferReply();

	const name = interaction.options.getString("name", true);
	const unit = await Unit.findOne({ where: { name: name } });

	if(unit) {
		await interaction.editReply({ embeds: [ DeletePrompt(unit.name, unit.length) ] });
		const result = await confirmPrompt(interaction);

		if(result) {
			try {
				await unit.destroy();
				await interaction.editReply({ embeds: [ DeleteSuccess() ] });
			} catch(error) {
				await interaction.editReply({ embeds: [ DeleteError() ] });
			}
		} else {
			await interaction.editReply({ embeds: [ DeleteCancel() ] });
		}
	} else {
		await interaction.editReply({ embeds: [ DeleteNameNotFound(name) ] });
	}
}