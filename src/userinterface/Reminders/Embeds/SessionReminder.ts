import { Colors, EmbedBuilder } from "discord.js";

export function SessionReminder(stage: 0 | 1, unit: { name: string, length: number }, timeUntilSession: number, epochTime: number) {
	const unitTime = (timeUntilSession / unit.length);
	
	const reminder = new EmbedBuilder()
		.setTitle("Session Reminder")
		.setDescription(`A session is in ${unitTime} ${unit.name}(s)${stage == 1 ? "!" : "."}\n(<t:${epochTime}:R>)`);
	switch(stage) {
	case 0: reminder.setColor(Colors.Blue); break;
	case 1: reminder.setColor(Colors.Red); break;
	}
	return reminder;
}