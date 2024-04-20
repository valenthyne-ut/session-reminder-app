/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync, readdirSync, statSync } from "fs";
import { Command } from "../../types/Registry/Command";
import { Logger } from "../Logger";
import { HookableRegistry } from "./HookableRegistry";
import { InvalidCommandPathError, InvalidCommandsPathError, MalformedCommandError } from "../Errors/CommandRegistry";
import { join } from "path";
import { yellow } from "chalk";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";

const COMMAND_FILE_EXTENSION = ".js";
const UNCATEGORIZED_CATEGORY_NAME = "uncategorized";

export class CommandRegistry extends HookableRegistry {
	constructor(commandsPath: string, logger?: Logger, verbose?: boolean) {
		super(logger || new Logger("CommandRegistry"), verbose);
		
		if(!existsSync(commandsPath) || statSync(commandsPath).isFile()) {
			throw new InvalidCommandsPathError(commandsPath);
		}

		const commandCandidateMap: Map<string, Array<string>> = new Map();
		
		function pushToMap(category: string, path: string) {
			const categoryPaths = commandCandidateMap.get(category);
			if(categoryPaths) {
				categoryPaths.push(path);
				commandCandidateMap.set(category, categoryPaths);
			} else {
				commandCandidateMap.set(category, [path]);
			}
		}

		/*
		* Read the commands directory and look for candidates.
		* Currently supports commands that are categorized (commands in a named directory) 
		* and uncategorized (files sitting in the commands path).
		* 
		* Future version of the constructor will support subcommands.
		*/
		const commandsPathItems = readdirSync(commandsPath);
		for(const itemName of commandsPathItems) {
			const itemPath = join(commandsPath, itemName);
			if(statSync(itemPath).isDirectory()) {
				const categoryContents = readdirSync(itemPath);
				for(const categoryItem of categoryContents) {
					const categoryItemPath = join(itemPath, categoryItem);
					// Ignore all further directories and only add files as candidates.
					if(statSync(categoryItemPath).isFile() && categoryItemPath.endsWith(COMMAND_FILE_EXTENSION)) {
						pushToMap(itemName, categoryItemPath);
					}
				}
			} else {
				if(itemPath.endsWith(COMMAND_FILE_EXTENSION)) {
					pushToMap(UNCATEGORIZED_CATEGORY_NAME, itemPath);
				}
			}
		}

		if(this.verbose) { this.logger.info(`Found ${yellow(commandCandidateMap.size)} command candidates.`); }
		
		let registeredCommandsCount = 0;
		for(const category of commandCandidateMap.keys()) {
			const categoryCommands = commandCandidateMap.get(category);
			if(categoryCommands) {
				for(const commandPath of categoryCommands) {
					try {
						this.registerCommand(commandPath);
						registeredCommandsCount += 1;
					} catch(error) {
						this.logger.error(formatUnwrappedError(unwrapError(error)));
					}
				}
				if(this.verbose) {
					if(category == UNCATEGORIZED_CATEGORY_NAME) {
						this.logger.info(`Registered ${yellow(categoryCommands.length)} uncategorized commands(s).`);
					} else {
						this.logger.info(`Registered ${yellow(categoryCommands.length)} command(s) from category ${yellow(category)}.`);
					}
				}
			}
		}

		this.logger.info(`Registered ${yellow(registeredCommandsCount)} commands in total.`);
	}
	
	public static importCommand(path: string): Command {
		const command = require(path) as Command;
		if(command.data === undefined || command.guilds == undefined || command.execute === undefined) {
			throw new MalformedCommandError(path);
		}
		return command;
	}

	public override getHookables(): Array<Command> {
		return super.getHookables() as Array<Command>;
	}

	public override getHookableByName(name: string): Command | undefined {
		return super.getHookableByName(name) as Command | undefined;
	}

	public override getHookableByPath(path: string): Command | undefined {
		return super.getHookableByPath(path) as Command | undefined;	
	}

	public registerCommand(path: string): Command {
		if(!existsSync(path) || statSync(path).isDirectory()) { throw new InvalidCommandPathError(path); }

		const command = CommandRegistry.importCommand(path);
		const commandName = command.data.name;

		this.nameHookableMappings.set(commandName, command);
		this.pathNameMappings.set(path, commandName);

		return command;
	}
}