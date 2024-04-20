/* eslint-disable @typescript-eslint/no-var-requires */
import { ClientEvents, Interaction } from "discord.js";
import { Event } from "../../types/Registry/Event";
import { Logger } from "../Logger";
import { HookableRegistry } from "./HookableRegistry";
import { existsSync, readdirSync, statSync } from "fs";
import { InvalidEventPathError, InvalidEventsPathError } from "../Errors/EventRegistry";
import { MalformedEventError } from "../Errors/EventRegistry/";
import { ExtendedClient } from "../ExtendedClient";
import { join } from "path";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";
import { yellow } from "chalk";
import { InteractionsExecuteArguments } from "../../types/Registry";

const EVENT_FILE_EXTENSION = ".js";

export class EventRegistry extends HookableRegistry {
	private readonly client: ExtendedClient;

	constructor(eventsPath: string, client: ExtendedClient, logger?: Logger, verbose?: boolean) {
		super(logger || new Logger("EventRegistry"), verbose);
		if(!existsSync(eventsPath)) { throw new InvalidEventsPathError(eventsPath); }
		this.client = client;

		const eventsPathItems = readdirSync(eventsPath);
		let registeredEventsCount = 0;
		for(const eventFileName of eventsPathItems) {
			const eventPath = join(eventsPath, eventFileName);
			if(statSync(eventPath).isFile() && eventFileName.endsWith(EVENT_FILE_EXTENSION)) {
				try {
					this.registerEvent(eventPath);
					registeredEventsCount += 1;
				} catch(error) {
					this.logger.error(formatUnwrappedError(unwrapError(error)));
				}
			}
		}

		if(this.getHookableByName("interactionCreate") === undefined) {
			// eslint-disable-next-line @typescript-eslint/unbound-method
			this.client.on("interactionCreate", this.defaultInteractionHookImplementation);
		}

		this.logger.info(`Registered ${yellow(registeredEventsCount)} event(s) in total.`);
	}
	
	private async defaultInteractionHookImplementation(interaction: Interaction) {
		if(interaction.user.bot) return;
		if(interaction.isCommand()) {
			const commandInteraction = interaction as InteractionsExecuteArguments;
			const commandName = commandInteraction.commandName;
			const command = this.client.commands.getHookableByName(commandName);
			if(command) {
				try {
					await command.execute(commandInteraction);
				} catch(error) {
					this.logger.error("Command execution failed.");
					this.logger.error(formatUnwrappedError(unwrapError(error)));
				}
			} else {
				this.logger.warning(`Missed command execute from command named ${yellow(commandName)}.`);
			}
		}
	}

	public static importEvent(path: string): Event {
		const event = require(path) as Event;
		if(event.name === undefined || event.once === undefined || event.execute === undefined) {
			throw new MalformedEventError(path);
		}
		return event;
	}

	public override getHookables(): Array<Event> {
		return super.getHookables() as Array<Event>;	
	}
	
	public override getHookableByName(name: keyof ClientEvents): Event | undefined {
		return super.getHookableByName(name) as Event | undefined;
	}

	public override getHookableByPath(path: string): Event | undefined {
		return super.getHookableByPath(path) as Event | undefined;
	}

	public registerEvent(path: string): Event {
		if(!existsSync(path) || statSync(path).isDirectory()) { throw new InvalidEventPathError(path); } 
		
		const event = EventRegistry.importEvent(path);
		const eventName = event.name;

		this.nameHookableMappings.set(eventName, event);
		this.pathNameMappings.set(path, eventName);

		if(!event.once) {
			this.client.on(eventName, event.execute);
		} else {
			this.client.once(eventName, event.execute);
		}

		return event;
	}
}