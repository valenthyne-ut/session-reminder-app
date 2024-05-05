import { Colors, EmbedBuilder } from "discord.js";

export function CreateError() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription("Something went wrong while scheduling this session. Please, try again.");
}