import { ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";
import { Hookable, InteractionsExecute } from "./Hookable";

export type CommandBuilders =
	| SlashCommandBuilder
	| ContextMenuCommandBuilder;

export interface Command extends Hookable {
	data: CommandBuilders;
	guilds: Array<string>;
	execute: InteractionsExecute;
}