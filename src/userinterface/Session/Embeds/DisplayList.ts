import { Colors, EmbedBuilder } from "discord.js";

export function DisplayList(id: number, epochTime: number, currentSession: number, totalSessions: number, rotten?: true) {
	const embed = new EmbedBuilder()
		.setColor(rotten ? Colors.Grey : Colors.Blue)
		.setTitle("Session list")
		.setDescription(totalSessions > 1 ?
			`There are ${totalSessions} sessions scheduled.` :
			"There is 1 session scheduled."
		)
		.addFields(
			{ name: "ID", value: `${id}` }, 
			{ name: "Starts at (in your time)", value: `<t:${epochTime}:F>` }
		);
	if(totalSessions > 1) { embed.setFooter({ text: `${currentSession}/${totalSessions}` }); }

	return embed;
}