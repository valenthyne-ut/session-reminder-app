import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("hierarchical-command")
	.setDescription("A hierarchical command to test the registry.");

export const guilds = [];

// exporting an "execute" function is not necessary unless you would like to override the CommandRegistry's default implementation of one.