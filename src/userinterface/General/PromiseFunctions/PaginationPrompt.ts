import { ChatInputCommandInteraction } from "discord.js";
import { generateSameUserFilter } from ".";
import { formatUnwrappedError, unwrapError } from "../../../util/Errors";
import { PaginationRow } from "../ActionRows";

export type PaginationEvent = "first" | "previous" | "next" | "last";

export function paginationPrompt(interaction: ChatInputCommandInteraction): Promise<PaginationEvent> {
	return new Promise((resolve, reject) => {
		void interaction.editReply({ components: [ PaginationRow() ] }).then(async promptMessage => {
			await promptMessage.awaitMessageComponent({ filter: generateSameUserFilter(interaction), time: 60000 })
				.then(messageComponentInteraction => {
					resolve(messageComponentInteraction.customId as PaginationEvent);
				})
				.catch(error => {
					reject(formatUnwrappedError(unwrapError(error), false));
				});
		});
	});
}