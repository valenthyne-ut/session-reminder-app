import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { logger } from "../../classes/Logger";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";
import { ServerReminderConfig } from "../../classes/Database/Models";
import { GetReminderConfigError, GetReminderConfigSuccess, NoReminderConfig } from "../../userinterface/Reminders/Embeds";

export const data = new SlashCommandSubcommandBuilder()
	.setName("get-config")
	.setDescription("Get the configuration for this guild's reminders.");

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply();
	if(!interaction.guildId) { return await interaction.editReply("Cannot execute this command outside of a server."); }

	try {
		const guildReminderInfo = await ServerReminderConfig.findOne({ where: { serverId: interaction.guildId } });
		if(guildReminderInfo) {
			await interaction.editReply({ embeds: [ GetReminderConfigSuccess(guildReminderInfo.channelId) ] });
		} else {
			await interaction.editReply({ embeds: [ NoReminderConfig() ] });
		}
	} catch(error) {
		await interaction.editReply({ embeds: [ GetReminderConfigError() ] });
		logger.error(formatUnwrappedError(unwrapError(error)));
	}
}