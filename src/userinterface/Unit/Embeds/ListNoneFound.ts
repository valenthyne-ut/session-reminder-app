import { Colors, EmbedBuilder } from "discord.js";

export function ListNoneFound() {
	return new EmbedBuilder()
		.setColor(Colors.Purple)
		.setTitle("No units found.")
		.setDescription("This server hasn't defined any units.");
}