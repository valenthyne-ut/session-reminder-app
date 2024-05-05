import { Colors, EmbedBuilder } from "discord.js";

export function DeletePrompt(name: string, length: number) {
	return new EmbedBuilder()
		.setColor(Colors.Blue)
		.setTitle("Prompt")
		.setDescription("Are you sure you'd like to delete this unit?")
		.addFields(
			{ name: "Name", value: name }, 
			{ name: "Length (in seconds)", value: `${length} seconds` }
		);
}