import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { Session } from "../../classes/Database/Models";
import { ListNoneFound } from "../../userinterface/Session/Embeds";
import { PaginationEvent, paginationPrompt } from "../../userinterface/General/PromiseFunctions/PaginationPrompt";
import { DisplayList } from "../../userinterface/Session/Embeds";

export const data = new SlashCommandSubcommandBuilder()
	.setName("list")
	.setDescription("Display scheduled sessions.");

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply();
	if(!interaction.guildId) { return await interaction.editReply("Cannot execute this command outside of a server."); }

	const sessions = await Session.findAll({ where: { server_id: interaction.guildId } });
	if(sessions.length == 0) { return await interaction.editReply({ embeds: [ ListNoneFound() ] }); }

	let currentSessionIndex = 0, currentSession = sessions[currentSessionIndex];
	let rejected = false;

	const updateEmbed = async (rotten?: true) => {
		await interaction.editReply({
			embeds: [ DisplayList(currentSession.id, currentSession.date_time.getTime() / 1000, currentSessionIndex + 1, sessions.length, rotten) ],
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
		case "first": 	 currentSessionIndex = 0; break; 
		case "previous": if(currentSessionIndex > 0) { currentSessionIndex--; }	break;
		case "next": 	 if(currentSessionIndex < sessions.length - 1) { currentSessionIndex++; } break; 
		case "last": 	 currentSessionIndex = sessions.length - 1;	break; 
		default: 		 rejected = true; break; 
		}

		currentSession = sessions[currentSessionIndex];
		await updateEmbed();
	}

	await updateEmbed(true);
}