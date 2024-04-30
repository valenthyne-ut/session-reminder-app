import { existsSync, statSync } from "fs";
import { CommandRegistryEntry } from "../../types/Registry/Command";
import { Logger } from "../Logger";
import { AbstractRegistry } from "./AbstractRegistry";
import { InvalidCommandsPathError } from "../Errors/Registry/Command";

export class CommandRegistry extends AbstractRegistry<CommandRegistryEntry> {
	private data: Map<string, CommandRegistryEntry>;

	constructor(commandsPath: string, logger?: Logger) {
		super(logger || new Logger("CommandRegistry"));
		if(!existsSync(commandsPath) || !statSync(commandsPath).isDirectory()) { throw new InvalidCommandsPathError(commandsPath); }
		this.data = new Map();
	}

	public fetchAll(): Array<CommandRegistryEntry> {
		return Array.from(this.data.values());
	}

	public fetchByIdentifier(identifier: string): CommandRegistryEntry | undefined {
		return this.data.get(identifier);
	}

	public push(entry: CommandRegistryEntry): void {
		this.data.set(entry.command.data.name, entry);
	}
}