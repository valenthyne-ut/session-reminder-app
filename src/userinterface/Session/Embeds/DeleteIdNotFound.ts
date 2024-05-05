import { Colors, EmbedBuilder } from "discord.js";

export function DeleteIdNotFound(id: number) {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription(`Couldn't find a session with ID **${id}**.`);
}