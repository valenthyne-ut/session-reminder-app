import { Colors, EmbedBuilder } from "discord.js";

export function GetConfigSuccess(channelId: string, roleId: string) {
	return new EmbedBuilder()
		.setColor(Colors.Green)
		.setTitle("Configuration")
		.setDescription("This server's reminder configuration.")
		.addFields(
			{ name: "Channel to send reminders to", value: `<#${channelId}>` },
			{ name: "Role to notify when a reminder is sent", value: `<@&${roleId}>` }
		);
}