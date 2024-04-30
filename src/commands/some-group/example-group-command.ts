import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("example-group-command")
	.setDescription("A command to test the CommandRegistry reading command groups.");

export const guilds = [];

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.reply("Hello world, from a grouped command!");
}