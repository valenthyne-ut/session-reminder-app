import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { Session } from "../../classes/Database/Models";
import { logger } from "../../classes/Logger";
import { confirmPrompt } from "../../userinterface/General/PromiseFunctions";
import { DeleteCancel, DeleteError, DeleteIdNotFound, DeletePrompt, DeleteSuccess } from "../../userinterface/Session/Embeds";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";

export const data = new SlashCommandSubcommandBuilder()
	.setName("cancel")
	.setDescription("Cancel a session.")
	.addIntegerOption(option =>
		option
			.setName("id")
			.setDescription("The session's ID.")
			.setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply();
	if(!interaction.guildId) { return await interaction.editReply("Cannot execute this command outside of a guild."); }
	
	const sessionId = interaction.options.getInteger("id", true);
	const session = await Session.findOne({ where: { id: sessionId, server_id: interaction.guildId } });

	if(session) {
		await interaction.editReply({ embeds: [ DeletePrompt(sessionId, session.date_time.getTime() / 1000) ] });
		const result = await confirmPrompt(interaction);

		if(result) {
			try {
				await session.destroy();
				await interaction.editReply({ embeds: [ DeleteSuccess() ] });
			} catch(error) {
				await interaction.editReply({ embeds: [ DeleteError() ] });
				logger.error(formatUnwrappedError(unwrapError(error)));
			}
		} else {
			await interaction.editReply({ embeds: [ DeleteCancel() ] });
		}
	} else {
		await interaction.editReply({ embeds: [ DeleteIdNotFound(sessionId) ] });
	}
}