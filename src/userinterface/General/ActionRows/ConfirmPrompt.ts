import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function ConfirmPrompt() {
	return new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("confirm")
				.setLabel("Confirm")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("cancel")
				.setLabel("Cancel")
				.setStyle(ButtonStyle.Danger)
		);
}