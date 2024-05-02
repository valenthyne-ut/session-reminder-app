import { Colors, EmbedBuilder } from "discord.js";

export function GetReminderConfigSuccess(channelId: string) {
	return new EmbedBuilder()
		.setColor(Colors.Green)
		.setTitle("Configuration")
		.setDescription("This server's reminder configuration.")
		.addFields(
			{ name: "Channel to send reminders to", value: `<#${channelId}>` },
		);
}