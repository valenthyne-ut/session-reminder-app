import { Client } from "discord.js";
import { ExtendedClientOptions } from "../../types/ExtendedClient/ExtendedClientOptions";
import { CommandRegistry } from "../Registry";

export class ExtendedClient extends Client {
	public readonly commands: CommandRegistry;

	constructor(options: ExtendedClientOptions) {
		super(options);
		this.commands = new CommandRegistry(options.commandsPath);
	}
}