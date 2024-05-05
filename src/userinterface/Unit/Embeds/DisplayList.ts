import { Colors, EmbedBuilder } from "discord.js";
import { Unit } from "../../../classes/Database/Models";

export function DisplayList(units: Array<Unit>, currentPage: number, totalPages: number, totalUnits: number, fetchedTime: Date, rotten?: true) {
	const embed = new EmbedBuilder()
		.setColor(rotten ? Colors.Grey : Colors.Blue)
		.setTitle("Unit list")
		.setDescription(totalUnits > 1 ?
			`There are ${totalUnits} units defined.` :
			"There is 1 unit defined."
		)
		.setTimestamp(fetchedTime);

	for(let i = 0; i < units.length; i++) {
		const curUnit = units[i];
		embed.addFields(
			{ name: "Name", value: curUnit.name, inline: true },
			{ name: "Length (in seconds)", value: `${curUnit.length} seconds`, inline: true },
			{ name: "** **", value: "** **", inline: true }
		);
	}

	if(totalPages > 1) { embed.setFooter({ text: `${currentPage}/${totalPages}` }); }
	return embed;
}