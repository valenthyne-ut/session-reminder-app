import { ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Hookable, InteractionsExecute } from "./Hookable";

export type CommandBuilders =
	| SlashCommandBuilder
	| ContextMenuCommandBuilder
	| SlashCommandSubcommandBuilder;

export interface Command extends Hookable {
	data: CommandBuilders;
	guilds: Array<string>;
	execute: InteractionsExecute;
}