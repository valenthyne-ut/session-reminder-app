import { existsSync, readdirSync, statSync } from "fs";
import { Event } from "../../types/Registry/Event";
import { InvalidEventError, InvalidEventsPathError } from "../Errors/Registry/Event";
import { Logger } from "../Logger";
import { AbstractRegistry } from "./AbstractRegistry";
import { join } from "path";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";
import { yellow } from "chalk";

const EVENT_FILE_EXTENSION = ".js";

export class EventRegistry extends AbstractRegistry<Event> {
	private data: Array<Event>;

	constructor(eventsPath: string, logger?: Logger) {
		super(logger || new Logger("EventRegistry"));
		if(!existsSync(eventsPath) || !statSync(eventsPath).isDirectory()) { throw new InvalidEventsPathError(eventsPath); }
		this.data = [];

		const eventsPathItems = readdirSync(eventsPath);
		let registeredCount = 0;

		for(const eventFilename of eventsPathItems) {
			const eventFilePath = join(eventsPath, eventFilename);
			if(statSync(eventFilePath).isFile() && eventFilePath.endsWith(EVENT_FILE_EXTENSION)) {
				try {
					const event = EventRegistry.importEvent(eventFilePath);
					this.push(event);
					registeredCount++;
				} catch(error) {
					this.logger.error(formatUnwrappedError(unwrapError(error), false));
				}
			}
		}

		this.logger.info(`Registered ${yellow(registeredCount)} event(s).`);
	}

	private static importEvent(path: string): Event {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const event = require(path) as Event;
		
		if(event.name === undefined || typeof event.name !== "string") { 
			throw new InvalidEventError(path, `Event doesn't export ${yellow("name")}, or it isn't of type ${yellow("string")}.`);
		}
		if(event.once === undefined || typeof event.once !== "boolean") {
			throw new InvalidEventError(path, `Event doesn't export ${yellow("once")}, or it isn't of type ${yellow("boolean")}.`);
		}
		if(event.listener === undefined || typeof event.listener !== "function") {
			throw new InvalidEventError(path, `Event doesn't export ${yellow("listener")}, or it isn't of type ${yellow("function")}.`);
		}

		return event;
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