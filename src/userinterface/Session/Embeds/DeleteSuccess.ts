import { Colors, EmbedBuilder } from "discord.js";

export function DeleteSuccess() {
	return new EmbedBuilder()
		.setColor(Colors.DarkGreen)
		.setTitle("Success")
		.setDescription("Successfully cancelled this session.");
}