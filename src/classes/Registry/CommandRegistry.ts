import { yellow } from "chalk";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { Command, CommandRegistryEntry } from "../../types/Registry/Command";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";
import { InvalidCommandError, InvalidCommandsPathError, NoHierarchySubcommandsFoundError } from "../Errors/Registry/Command";
import { Logger } from "../Logger";
import { AbstractRegistry } from "./AbstractRegistry";

const COMMAND_FILE_EXTENSION = ".js";

export class CommandRegistry extends AbstractRegistry<CommandRegistryEntry> {
	private data: Map<string, CommandRegistryEntry>;

	constructor(commandsPath: string, logger?: Logger) {
		super(logger || new Logger("CommandRegistry"));
		if(!existsSync(commandsPath) || !statSync(commandsPath).isDirectory()) { throw new InvalidCommandsPathError(commandsPath); }
		this.data = new Map();

		const candidates: Array<{ path: string, hierarchy: boolean }> = [];
		function pushCandidate(path: string, hierarchy: boolean) {
			if(!path.endsWith(COMMAND_FILE_EXTENSION)) { return; }
			if(candidates.find(candidate => candidate.path === path)) { return; }

			candidates.push({ path: path, hierarchy: hierarchy });
		}

		const commandsPathItems = readdirSync(commandsPath);	
		for(const itemName of commandsPathItems) {
			const itemPath = join(commandsPath, itemName);
			const itemStat = statSync(itemPath);
			if(itemStat.isFile()) {
				const itemNameWithoutExtension = itemName.replace(COMMAND_FILE_EXTENSION, "");
				const isHierarchyCommand = commandsPathItems.includes(itemNameWithoutExtension);
				pushCandidate(itemPath, isHierarchyCommand);
			} else if(itemStat.isDirectory()) {
				const itemNameWithExtension = itemName + COMMAND_FILE_EXTENSION;
				const isHierarchyCommandFolder = commandsPathItems.includes(itemNameWithExtension);
				if(isHierarchyCommandFolder) {
					pushCandidate(join(commandsPath, itemNameWithExtension), true);
				} else {
					const groupFolderContents = readdirSync(itemPath);
					for(const groupItemName of groupFolderContents) {
						const groupItemPath = join(itemPath, groupItemName);
						if(statSync(groupItemPath).isFile()) { pushCandidate(groupItemPath, false); }
					}
				}
			}
		}

		let registeredCount = 0;
		for(const candidate of candidates) {
			const { path, hierarchy } = candidate;
			try {
				const entry: CommandRegistryEntry = {
					command: CommandRegistry.importCommand(path, hierarchy),
					subcommands: []
				};

				if(hierarchy) {
					const subcommandsDirectoryPath = path.replace(COMMAND_FILE_EXTENSION, "");
					const subcommandsDirectoryContents = readdirSync(subcommandsDirectoryPath);
					for(const subcommandFilename of subcommandsDirectoryContents) {
						const subcommandFilePath = join(subcommandsDirectoryPath, subcommandFilename);
						if(statSync(subcommandFilePath).isFile()) {
							try {
								const subcommand = CommandRegistry.importCommand(subcommandFilePath, false);
								(entry.command.data as SlashCommandBuilder).addSubcommand(subcommand.data as SlashCommandSubcommandBuilder);
								entry.subcommands.push(subcommand);
							} catch(error) {
								this.logger.error(formatUnwrappedError(unwrapError(error)));
							}
						}
					}

					if(entry.subcommands.length == 0) {
						throw new NoHierarchySubcommandsFoundError(entry.command.data.name);
					}
				}

				this.push(entry);
				registeredCount++;
			} catch(error) {
				this.logger.error(formatUnwrappedError(unwrapError(error)));
			}
		}

		this.logger.info(`Registered ${yellow(registeredCount)} command(s).`);
	}

	private static importCommand(path: string, hierarchy: boolean): Command {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const command = require(path) as Command;

		if(command.data === undefined) {
			throw new InvalidCommandError(path, `Command doesn't export ${yellow("data")}.`);
		}

		if(!hierarchy && (command.execute === undefined || typeof command.execute !== "function")) {
			throw new InvalidCommandError(path, `Command doesn't export ${yellow("execute")}, or it isn't of type ${yellow("function")}.`);
		}

		if(hierarchy && command.execute !== undefined && typeof command.execute !== "function") {
			throw new InvalidCommandError(path, `Hierarchy command export ${"execute"} isn't of type ${yellow("function")}.`);
		}

		return command;
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