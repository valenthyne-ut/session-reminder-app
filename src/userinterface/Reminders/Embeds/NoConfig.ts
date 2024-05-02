import { Colors, EmbedBuilder } from "discord.js";

export function NoConfig(fromSessionCommand: boolean = false) {
	return new EmbedBuilder()
		.setColor(Colors.Purple)
		.setTitle("No reminder configuration found")
		.setDescription(
			"This server hasn't set a reminder configuration." + 
			(fromSessionCommand ? 
				" Please set one before using session commands." : 
				"")
		);
}