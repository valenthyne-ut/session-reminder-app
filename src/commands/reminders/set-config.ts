import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";

export const data = new SlashCommandSubcommandBuilder()
	.setName("set-config")
	.setDescription("Set the configuration for this guild's reminders.");

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.reply("WIP");
}