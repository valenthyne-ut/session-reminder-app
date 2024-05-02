import { Colors, EmbedBuilder } from "discord.js";

export function NoReminderConfig() {
	return new EmbedBuilder()
		.setColor(Colors.Purple)
		.setTitle("No reminder configuration found")
		.setDescription("This server hasn't set a custom reminder configuration.");
}