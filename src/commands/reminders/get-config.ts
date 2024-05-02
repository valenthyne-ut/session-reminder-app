import { SlashCommandSubcommandBuilder } from "discord.js";
import { ServerReminderConfig } from "../../classes/Database/Models";
import { logger } from "../../classes/Logger";
import { GuildChatInputCommandInteraction } from "../../types/ExtendedTypes";
import { GetConfigError, GetConfigSuccess, NoConfig } from "../../userinterface/Reminders/Embeds";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";

export const data = new SlashCommandSubcommandBuilder()
	.setName("get-config")
	.setDescription("Get the configuration for this guild's reminders.");

export async function execute(interaction: GuildChatInputCommandInteraction) {
	await interaction.deferReply({ ephemeral: true });

	try {
		const serverConfig = await ServerReminderConfig.findOne({ where: { serverId: interaction.guildId } });
		if(serverConfig) {
			await interaction.editReply({ embeds: [ GetConfigSuccess(serverConfig.channelId, serverConfig.roleId) ] });
		} else {
			await interaction.editReply({ embeds: [ NoConfig() ] });
		}
	} catch(error) {
		await interaction.editReply({ embeds: [ GetConfigError() ] });
		logger.error(formatUnwrappedError(unwrapError(error)));
	}
}