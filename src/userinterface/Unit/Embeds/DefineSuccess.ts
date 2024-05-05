import { Colors, EmbedBuilder } from "discord.js";

export function DefineSuccess(name: string, length: number) {
	return new EmbedBuilder()
		.setColor(Colors.DarkGreen)
		.setTitle("Success")
		.setDescription("Successfully defined a unit.")
		.addFields(
			{ name: "Name", value: name },
			{ name: "Length (in seconds)", value: `${length} seconds` }
		);
}