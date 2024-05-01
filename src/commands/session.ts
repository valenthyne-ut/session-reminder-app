import { PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("session")
	.setDescription("A command to manage sessions.")
	.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageEvents);

export const guilds = [];

export const DATETIME_PARSE_FORMAT = "DD-MM-YYYY HH:mm";
export const DATETIME_DISPLAY_FORMAT = "dddd[,] D MMMM YYYY HH[:]mm";