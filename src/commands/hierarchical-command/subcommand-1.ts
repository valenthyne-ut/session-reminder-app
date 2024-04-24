import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";

export const data = new SlashCommandSubcommandBuilder()
	.setName("hierarchical-subcommand-1")
	.setDescription("A subcommand to test the CommandRegistry's capabilites of reading hierarchical command structures.");

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.reply("Hello world, from a subcommand!");
}