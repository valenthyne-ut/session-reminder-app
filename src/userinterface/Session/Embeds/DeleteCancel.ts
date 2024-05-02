import { Colors, EmbedBuilder } from "discord.js";

export function DeleteCancel() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Deletion cancelled")
		.setDescription("Session was not cancelled.");
}