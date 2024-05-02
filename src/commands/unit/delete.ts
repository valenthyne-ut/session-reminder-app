import { SlashCommandSubcommandBuilder } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../types/ExtendedTypes";

export const data = new SlashCommandSubcommandBuilder()
	.setName("delete")
	.setDescription("Delete an existing unit.")
	.addStringOption(option =>
		option
			.setName("name")
			.setDescription("The unit's name.")
			.setRequired(true));

export async function execute(interaction: GuildChatInputCommandInteraction) {
	await interaction.reply("WIP");
}