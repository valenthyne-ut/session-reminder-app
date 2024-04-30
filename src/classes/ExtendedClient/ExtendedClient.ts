import { Client } from "discord.js";
import { ExtendedClientOptions } from "../../types/ExtendedClient/ExtendedClientOptions";
import { EventRegistry } from "../Registry/EventRegistry";

export class ExtendedClient extends Client {
	public readonly eventRegistry: EventRegistry;

	constructor(options: ExtendedClientOptions) {
		super(options);
		this.eventRegistry = new EventRegistry(options.eventsPath, this);
	}
}