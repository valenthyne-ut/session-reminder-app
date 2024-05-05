import { Colors, EmbedBuilder } from "discord.js";

export function GetConfigError() {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription("Something went wrong while getting this server's reminder configuration.");
}