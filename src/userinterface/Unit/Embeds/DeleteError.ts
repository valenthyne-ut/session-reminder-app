import { Colors, EmbedBuilder } from "discord.js";

export function DeleteError() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription("Something went wrong while deleting this unit. Please, try again.");
}