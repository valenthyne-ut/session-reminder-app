import { Colors, EmbedBuilder } from "discord.js";

export function CreateSameTimeError() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription("Can't schedule multiple sessions for the same time. Please, specify a different time for a new session.");
}