import { Colors, EmbedBuilder } from "discord.js";

export function ListNoneFound() {
	return new EmbedBuilder()
		.setColor(Colors.Purple)
		.setThumbnail("No sessions scheduled.")
		.setDescription("This server has no sessions scheduled.");
}