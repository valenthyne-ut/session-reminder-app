import { Client } from "discord.js";
import { ExtendedClientOptions } from "../../types/ExtendedClient/ExtendedClientOptions";
import { CommandRegistry } from "../Registry";
import { EventRegistry } from "../Registry/EventRegistry";

export class ExtendedClient extends Client {
	public readonly commands: CommandRegistry;
	public readonly events: EventRegistry;

	constructor(options: ExtendedClientOptions) {
		super(options);
		this.commands = new CommandRegistry(options.commandsPath);
		this.events = new EventRegistry(options.eventsPath, this);
	}
}