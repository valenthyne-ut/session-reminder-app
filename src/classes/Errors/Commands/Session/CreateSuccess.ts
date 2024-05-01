import { Colors, EmbedBuilder } from "discord.js";

export function CreateSuccess(id: number, epochTime: number, formattedTime: string) {
	return new EmbedBuilder()
		.setColor(Colors.DarkGreen)
		.setTitle("Success")
		.setDescription("Successfully scheduled a new session.")
		.addFields(
			{ name: "ID", value: id.toString() },
			{ name: "Your time", value: `<t:${epochTime}:F>` },
			{ name: "UTC time", value: formattedTime }
		);
}