import { SlashCommandSubcommandBuilder } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../types/ExtendedTypes";
import { ExtendedClient } from "../../classes/ExtendedClient";
import { ServerReminderConfig } from "../../classes/Database/Models";
import { NoConfig } from "../../userinterface/Reminders/Embeds";
import { logger } from "../../classes/Logger";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";

export const data = new SlashCommandSubcommandBuilder()	
	.setName("trigger")
	.setDescription("Manually trigger the next closest reminder to show up.");

export async function execute(interaction: GuildChatInputCommandInteraction) {
	if(!(await ServerReminderConfig.existsFor(interaction.guildId))) {
		return await interaction.reply({ embeds: [ NoConfig(true) ] });
	}
	
	await interaction.deferReply({ ephemeral: true });

	const guildId = interaction.guildId;
	const poller = (interaction.client as ExtendedClient).sessionPoller!;

	try {
		await poller.poll(guildId);
		await interaction.editReply("Manually sent session reminders.");
	} catch(error) {
		await interaction.editReply("Something went wrong while sending session reminders.");
		logger.error(formatUnwrappedError(unwrapError(error)));
	}
}