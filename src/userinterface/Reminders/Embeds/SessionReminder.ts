import { Colors, EmbedBuilder } from "discord.js";

export function SessionReminder(stage: 0 | 1, epochTime: number) {
	const reminder = new EmbedBuilder()
		.setTitle("Session Reminder")
		.setDescription(`Next session is <t:${epochTime}:R>${stage == 1 ? "!" : "."}`);
	switch(stage) {
	case 0: reminder.setColor(Colors.Blue); break;
	case 1: reminder.setColor(Colors.Red); break;
	}
	return reminder;
}