import { Colors, EmbedBuilder } from "discord.js";

export function CreateCancel() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Cancelled")
		.setDescription("Session scheduling cancelled.");
}