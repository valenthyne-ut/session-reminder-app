import { PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("reminders")
	.setDescription("Managing reminder-related configuration.")
	.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageEvents)
	.setDMPermission(false);

export const guilds = [];