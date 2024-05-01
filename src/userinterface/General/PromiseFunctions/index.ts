import { CommandInteraction, MessageComponentInteraction } from "discord.js";

export * from "./ConfirmPrompt";

export function generateSameUserFilter(interaction: CommandInteraction) {
	return (promptInteraction: MessageComponentInteraction) => {
		void promptInteraction.deferUpdate();
		return promptInteraction.user.id === interaction.user.id;
	};
}