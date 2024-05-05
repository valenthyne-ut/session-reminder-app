import { Colors, EmbedBuilder } from "discord.js";

export function ListNoneFound() {
	return new EmbedBuilder()
		.setColor(Colors.Purple)
		.setTitle("No sessions scheduled.")
		.setDescription("This server has no sessions scheduled.");
}