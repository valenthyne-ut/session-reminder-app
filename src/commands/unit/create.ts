import { SlashCommandSubcommandBuilder } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../types/ExtendedTypes";

export const data = new SlashCommandSubcommandBuilder()
	.setName("define")
	.setDescription("Define a new unit for use with the session reminding.")
	.addStringOption(option =>
		option
			.setName("name")
			.setDescription("The unit's name.")
			.setRequired(true))
	.addNumberOption(option =>
		option
			.setName("length")
			.setDescription("The length of time of this unit in seconds.")
			.setRequired(true)
			.setMinValue(0)
			.setMaxValue(Number.MAX_VALUE));

export async function execute(interaction: GuildChatInputCommandInteraction) {
	await interaction.reply("WIP");
}