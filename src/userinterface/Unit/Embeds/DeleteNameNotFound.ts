import { Colors, EmbedBuilder } from "discord.js";

export function DeleteNameNotFound(name: string) {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription(`Couldn't find a unit with name **${name}**.`);
}