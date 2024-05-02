import { Colors, EmbedBuilder } from "discord.js";

export function SetConfigError() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription("Something went wrong while setting this server's reminder configuration.");
}