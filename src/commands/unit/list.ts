import { SlashCommandSubcommandBuilder } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../types/ExtendedTypes";
import { ServerReminderConfig, Unit } from "../../classes/Database/Models";
import { NoConfig } from "../../userinterface/Reminders/Embeds";
import { DisplayList, ListNoneFound } from "../../userinterface/Unit/Embeds";
import { PaginationEvent, paginationPrompt } from "../../userinterface/General/PromiseFunctions";

export const data = new SlashCommandSubcommandBuilder()
	.setName("list")
	.setDescription("Display defined units.");

export async function execute(interaction: GuildChatInputCommandInteraction) {
	if(!(await ServerReminderConfig.existsFor(interaction.guildId))) {
		return await interaction.reply({ embeds: [ NoConfig(true) ] });
	}

	await interaction.deferReply();

	const units = await Unit.findAll({ where: { serverId: interaction.guildId } });
	if(units.length == 0) { return await interaction.editReply({ embeds: [ ListNoneFound() ] }); }

	/**
	 * [u1, u2, u3, u4, u5, u6, u7, u8, u9, u10, u11, u12]
	 * 3 pages, 12 units
	 * 
	 * first slice = 	[u1, u2, u3, u4, u5]
	 * second slice = 	[u6, u7, u8, u9, u10]
	 * third slice = 	[u11, u12]
	 */

	const totalPages = Math.ceil(units.length / 5);
	const unitPages: Array<Array<Unit>> = [];
	for(let i = 0; i < totalPages; i++) {
		const curPage: Array<Unit> = [];
		for(let j = 0; j < 5; j++) {
			const curUnit = units[i * 5 + j];
			if(curUnit) { curPage.push(curUnit); }
		}
		unitPages.push(curPage);
	}

	let curPage = 0, curPageUnits = unitPages[curPage];
	let rejected = false;

	const fetchedTime = new Date();
	const updateEmbed = async (rotten?: true) => {
		await interaction.editReply({  
			embeds: [ DisplayList(curPageUnits, curPage + 1, totalPages, units.length, fetchedTime, rotten) ],
			components: rotten ? [] : undefined
		});
	};

	await updateEmbed();

	while(!rejected) {
		let paginationEvent: PaginationEvent | undefined;
		try {
			paginationEvent = await paginationPrompt(interaction);
		} catch(error) {
			rejected = true;
			break;
		}

		switch(paginationEvent) {
		case "first": 		curPage = 0; break;
		case "previous": 	if(curPage > 0) { curPage--; } break;
		case "next": 		if(curPage < totalPages - 1) { curPage++; } break;
		case "last": 		curPage = totalPages - 1; break;
		default:			rejected = true; break;
		}

		curPageUnits = unitPages[curPage];
		await updateEmbed();
	}

	await updateEmbed(true);
}