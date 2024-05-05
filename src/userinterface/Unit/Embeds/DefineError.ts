import { Colors, EmbedBuilder } from "discord.js";

export function DefineError() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription("Something went wrong while defining this unit. Please, try again.");
}