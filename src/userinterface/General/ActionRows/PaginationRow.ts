import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function PaginationRow() {
	return new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("first")
				.setLabel("<--")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("previous")
				.setLabel("<")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("next")
				.setLabel(">")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("last")
				.setLabel("-->")
				.setStyle(ButtonStyle.Primary)
		);
}