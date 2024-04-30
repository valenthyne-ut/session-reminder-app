import { existsSync, readdirSync, statSync } from "fs";
import { DiscriminatedEvent, Event } from "../../types/Registry/Event";
import { InvalidEventError, InvalidEventsPathError } from "../Errors/Registry/Event";
import { Logger } from "../Logger";
import { AbstractRegistry } from "./AbstractRegistry";
import { join } from "path";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";
import { yellow } from "chalk";
import { ClientEvents, Interaction, InteractionType } from "discord.js";
import { ExtendedClient } from "../ExtendedClient";
import { CommandExecuteFunction } from "../../types/Registry/Command";
import { CommandMissingExecuteError } from "../Errors/Registry/Command";

const EVENT_FILE_EXTENSION = ".js";

export class EventRegistry extends AbstractRegistry<Event> {
	private data: Array<Event>;
	private readonly client: ExtendedClient;

	constructor(eventsPath: string, client: ExtendedClient, logger?: Logger) {
		super(logger || new Logger("EventRegistry"));
		if(!existsSync(eventsPath) || !statSync(eventsPath).isDirectory()) { throw new InvalidEventsPathError(eventsPath); }
		this.data = [];
		this.client = client;

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

		if(!this.fetchByIdentifier("interactionCreate")) {
			this.logger.warning(`Using default ${yellow("interactionCreate")} event implementation.`);
			const defaultEvent: DiscriminatedEvent<"interactionCreate"> = {
				name: "interactionCreate",
				once: false,
				listener: EventRegistry.defaultInteractionCreateEventImplementation.bind(this)
			};

			this.push(defaultEvent as Event);
			registeredCount++;
		}

		this.logger.info(`Registered ${yellow(registeredCount)} event(s).`);
	}

	private static async defaultInteractionCreateEventImplementation(this: EventRegistry, interaction: Interaction) {
		if(interaction.user.bot) return;
		switch(interaction.type) {
		case InteractionType.ApplicationCommand: {
			const commandName = interaction.commandName;
			const entry = this.client.commandRegistry.fetchByIdentifier(commandName);
			if(entry) {
				let execute: CommandExecuteFunction<typeof interaction> | undefined = entry.command.execute;
				if(interaction.isChatInputCommand()) {
					const subcommandName = interaction.options.getSubcommand();
					if(subcommandName) {
						if(entry.subcommands) {
							const subcommand = entry.subcommands.find(subcommand => subcommand.data.name === subcommandName);
							if(subcommand) {
								execute = subcommand.execute;
							}
						}
					}
				}

				try {
					if(!execute) { throw new CommandMissingExecuteError(commandName); }
					await execute(interaction);
				} catch(error) {
					this.logger.error("Command execution failed.");
					this.logger.error(formatUnwrappedError(unwrapError(error)));
				}
			} else {
				this.logger.error(`Missed execute call for command named ${yellow(commandName)}.`);
			}
			break; 
		}
		case InteractionType.MessageComponent: case InteractionType.ApplicationCommandAutocomplete:	case InteractionType.ModalSubmit: {
			if(interaction.isRepliable()) {
				await interaction.reply({ content: "Not implemented.", ephemeral: true });
			}
			break;
		}}
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

	public fetchByIdentifier<Identifier extends keyof ClientEvents>(identifier: Identifier): DiscriminatedEvent<Identifier> | undefined {
		return this.data.find(event => event.name === identifier) as DiscriminatedEvent<Identifier> | undefined;
	}

	public push(entry: Event): void {
		this.data.push(entry);
		if(!entry.once) {
			this.client.on(entry.name, entry.listener);
		} else {
			this.client.once(entry.name, entry.listener);
		}
	}
}