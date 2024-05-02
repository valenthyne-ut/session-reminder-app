import { Colors, EmbedBuilder } from "discord.js";

export function SetConfigSuccess(channelId: string, roleId: string) {
	return new EmbedBuilder()
		.setColor(Colors.Green)
		.setTitle("Success")
		.setDescription("Successfully updated this server's reminder configuration.")
		.addFields(
			{ name: "Channel to send reminders to", value: `<#${channelId}>` },
			{ name: "Role to notify when a reminder is sent", value: `<@&${roleId}>` }
		);
}