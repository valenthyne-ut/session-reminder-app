import { Colors, EmbedBuilder } from "discord.js";

export function DefineCancel() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Cancelled")
		.setDescription("Unit defining cancelled.");
}