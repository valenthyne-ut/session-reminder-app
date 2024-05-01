import { Colors, EmbedBuilder } from "discord.js";

export function CreatePastError() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription("Cannot schedule a session in the past.");
}