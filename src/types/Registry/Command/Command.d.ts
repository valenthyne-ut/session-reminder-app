import { ContextMenuCommandBuilder, Interaction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

export type CommandBuilders =
	| SlashCommandBuilder
	| SlashCommandSubcommandBuilder
	| ContextMenuCommandBuilder;

export type CommandExecuteFunction<T extends Interaction> =
	(interaction: T) => Promise<void>;

export interface Command {
	data: CommandBuilders
	execute: CommandExecuteFunction<Interaction>;
}