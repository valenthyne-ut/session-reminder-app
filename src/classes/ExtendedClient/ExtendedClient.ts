import { Client } from "discord.js";
import { ExtendedClientOptions } from "../../types/ExtendedClient/ExtendedClientOptions";
import { CommandRegistry } from "../Registry";
import { EventRegistry } from "../Registry";
import { SessionPoller } from "../SessionPoller";

export class ExtendedClient extends Client {
	public readonly commandRegistry: CommandRegistry;
	public readonly eventRegistry: EventRegistry;
	public sessionPoller: SessionPoller | undefined;

	constructor(options: ExtendedClientOptions) {
		super(options);
		this.commandRegistry = new CommandRegistry(options.commandsPath);
		this.eventRegistry = new EventRegistry(options.eventsPath, this);
	}
}