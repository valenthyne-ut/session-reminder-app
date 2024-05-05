import { Colors, EmbedBuilder } from "discord.js";

export function CreateInTimeframePrompt() {
	return new EmbedBuilder()
		.setColor(Colors.Blue)
		.setTitle("Prompt")
		.setDescription(
			"There is already a scheduled session within a 2 hour timeframe of the one you're trying to schedule. " + 
			"Please confirm whether you'd like to schedule another within that timeframe."
		);
}