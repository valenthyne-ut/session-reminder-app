import { SlashCommandSubcommandBuilder } from "discord.js";
import { GuildChatInputCommandInteraction } from "../../types/ExtendedTypes";

export const data = new SlashCommandSubcommandBuilder()
	.setName("set-config")
	.setDescription("Set the configuration for this guild's reminders.");

export async function execute(interaction: GuildChatInputCommandInteraction) {
	await interaction.reply("WIP");
}