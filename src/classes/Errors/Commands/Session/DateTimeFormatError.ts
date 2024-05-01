import { Colors, EmbedBuilder } from "discord.js";
import { DATETIME_PARSE_FORMAT } from "../../../../commands/session";

export function DateTimeFormatError(erroneousFormat: string) {
	return new EmbedBuilder()
		.setColor(Colors.Red)
		.setTitle("Error")
		.setDescription(
			`Invalid datetime format **${erroneousFormat}** provided.` +
			`Correct format is **${DATETIME_PARSE_FORMAT}**\n` +
			"(where DD = day, MM = month, YYYY = year, HH = hours, mm = minutes)"
		);
}