import { Colors, EmbedBuilder } from "discord.js";

export function SessionStarting() {
	return new EmbedBuilder()
		.setColor(Colors.Green)
		.setTitle("Session Starting")
		.setDescription("A session is starting!!");
}