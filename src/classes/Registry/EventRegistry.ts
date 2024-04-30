import { existsSync, statSync } from "fs";
import { Event } from "../../types/Registry/Event";
import { InvalidEventsPathError } from "../Errors/Registry/Event";
import { Logger } from "../Logger";
import { AbstractRegistry } from "./AbstractRegistry";

export class EventRegistry extends AbstractRegistry<Event> {
	private data: Array<Event>;

	constructor(eventsPath: string, logger?: Logger) {
		super(logger || new Logger("EventRegistry"));
		if(!existsSync(eventsPath) || !statSync(eventsPath).isDirectory()) { throw new InvalidEventsPathError(eventsPath); }
		this.data = [];
	}

	public fetchAll(): Array<Event> {
		return this.data;
	}

	public fetchByIdentifier(identifier: string): Event | undefined {
		return this.data.find(event => event.name === identifier);
	}

	public push(entry: Event): void {
		this.data.push(entry);
	}
}