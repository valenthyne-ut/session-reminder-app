import { PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("unit")
	.setDescription("Command for management of units.")
	.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageEvents)
	.setDMPermission(false);

export const guilds = [];