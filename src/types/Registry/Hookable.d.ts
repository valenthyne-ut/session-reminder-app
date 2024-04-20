import { ChatInputCommandInteraction, ContextMenuCommandInteraction, ClientEvents, Awaitable } from "discord.js";

export type InteractionsExecuteArguments = 
	| ChatInputCommandInteraction
	| ContextMenuCommandInteraction;

export type ListenerExecuteArguments = 
	ClientEvents[keyof ClientEvents];

export type InteractionsExecute = (interaction: InteractionsExecuteArguments) => Promise<void>;
export type ListenerExecute = (...args: ListenerExecuteArguments) => Awaitable<void>;

export interface Hookable {
	execute:
		| InteractionsExecute
		| ListenerExecute
}