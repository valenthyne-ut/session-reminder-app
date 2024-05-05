import { EmbedBuilder } from "@discordjs/builders";
import { Colors } from "discord.js";

export function UpdateExistingUnitPrompt(name: string) {
	return new EmbedBuilder()
		.setColor(Colors.Blue)
		.setTitle("Prompt")
		.setDescription(`There is already a unit with the name **${name}**. ` + "Would you like to update it instead?");
}