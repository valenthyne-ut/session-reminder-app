import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("example-categorized-command")
	.setDescription("A command to test the CommandRegistry.");

export const guilds = [];

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.reply("Hello world!");
}