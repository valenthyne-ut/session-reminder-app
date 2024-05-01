import { ChatInputCommandInteraction, MessageComponentInteraction } from "discord.js";
import { ConfirmPrompt } from "../Session/ActionRows";

export function confirmPrompt(interaction: ChatInputCommandInteraction): Promise<boolean> {
	return new Promise((resolve, reject) => {
		void interaction.editReply({ components: [ ConfirmPrompt() ] }).then(async promptMessage => {
			const filter = (promptInteraction: MessageComponentInteraction) => {
				void promptInteraction.deferUpdate();
				return promptInteraction.user.id === interaction.user.id;
			};

			await promptMessage.awaitMessageComponent({ filter: filter, time: 60000 })
				.then(async messageComponentInteraction => {
					await promptMessage.edit({ components: [] });
					switch(messageComponentInteraction.customId as "confirm" | "cancel") {
					case "confirm": {
						resolve(true);
						break; }
					case "cancel": default: {
						reject(false);
						break; }
					}
				})
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				.catch(_ => { reject(false); });
		});
	});
}