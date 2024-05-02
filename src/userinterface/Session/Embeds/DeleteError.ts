import { Colors, EmbedBuilder } from "discord.js";

export function DeleteError() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription("Something went wrong while canceling this session. Please, try again.");
}