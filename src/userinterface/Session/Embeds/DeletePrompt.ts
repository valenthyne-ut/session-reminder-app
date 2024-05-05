import { Colors, EmbedBuilder } from "discord.js";

export function DeletePrompt(id: number, epochTime: number) {
	return new EmbedBuilder()
		.setColor(Colors.Blue)
		.setTitle("Prompt")
		.setDescription("Are you sure you'd like to cancel this session?")
		.addFields(
			{ name: "ID", value: `${id}` }, 
			{ name: "Starts at (in your time)", value: `<t:${epochTime}:F>` }
		);
}