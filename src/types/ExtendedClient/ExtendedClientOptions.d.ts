import { ClientOptions } from "discord.js";

export interface ExtendedClientOptions extends ClientOptions {
	commandsPath: string;
	eventsPath: string;
}