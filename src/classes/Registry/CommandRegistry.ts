/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync, readdirSync, statSync } from "fs";
import { Command } from "../../types/Registry/Command";
import { Logger } from "../Logger";
import { HookableRegistry } from "./HookableRegistry";
import { DuplicateCommandError, InvalidCommandPathError, InvalidCommandsPathError, MalformedCommandError } from "../Errors/CommandRegistry";
import { join } from "path";
import { yellow } from "chalk";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";
import { CandidateCommand } from "../../types/Registry/CandidateCommand";
import { HierarchicalCommand } from "../../types/Registry/HierarchicalCommand";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

const COMMAND_FILE_EXTENSION = ".js";

export class CommandRegistry extends HookableRegistry {
	constructor(commandsPath: string, logger?: Logger, verbose?: boolean) {
		super(logger || new Logger("CommandRegistry"), verbose);
		
		if(!existsSync(commandsPath) || statSync(commandsPath).isFile()) {
			throw new InvalidCommandsPathError(commandsPath);
		}

		const candidateCommands: Array<CandidateCommand> = [];
		function pushCandidate(filename: string, path: string, hierarchical: boolean) {
			if(!filename.endsWith(COMMAND_FILE_EXTENSION)) { return; }
			if(candidateCommands.find(candidate => candidate.path === path)) { return; }

			candidateCommands.push({
				filename: filename,
				path: path,
				hierarchical: hierarchical
			});
		}

		const commandsPathItems = readdirSync(commandsPath);
		for(const itemName of commandsPathItems) {
			const itemPath = join(commandsPath, itemName);
			if(statSync(itemPath).isDirectory()) {
				const itemNameWithExtension = itemName + COMMAND_FILE_EXTENSION;
				const isHierarchicalSubcommandFolder = commandsPathItems.includes(itemNameWithExtension);
				if(isHierarchicalSubcommandFolder) {
					pushCandidate(itemNameWithExtension, itemPath + COMMAND_FILE_EXTENSION, true);
				} else {
					const groupPathContents = readdirSync(itemPath);
					for(const groupItemName of groupPathContents) {
						const groupItemPath = join(itemPath, groupItemName);
						if(statSync(groupItemPath).isFile()) { pushCandidate(groupItemName, groupItemPath, false); }
					}
				}
			} else {
				const itemNameWithoutExtension = itemName.replace(COMMAND_FILE_EXTENSION, "");
				const isHierarchicalCommandFile = commandsPathItems.includes(itemNameWithoutExtension);
				pushCandidate(itemName, itemPath, isHierarchicalCommandFile);
			}
		}

		let registeredCount = 0;
		for(const candidate of candidateCommands) { 
			const { path, hierarchical } = candidate;
			try {
				this.registerCommand(path, hierarchical);
				registeredCount++;
			} catch(error) {
				this.logger.error(formatUnwrappedError(unwrapError(error)), false);
			}
		}

		this.logger.info(`Registered ${yellow(registeredCount)} command(s) in total.`);
	}
	
	public static importCommand(path: string, hierarchical: boolean): Command {
		const command = require(path) as Command;
		if(command.data === undefined || (command.guilds === undefined && !hierarchical) || (command.execute === undefined && !hierarchical)) {
			throw new MalformedCommandError(path);
		}
		return command;
	}

	public override getHookables(): Array<Command | Array<Command>> {
		return super.getHookables() as Array<Command | Array<Command>>;
	}

	public override getHookableByName(name: string): Command | Array<Command> | undefined {
		return super.getHookableByName(name) as Command | Array<Command> | undefined;
	}

	public override getHookableByPath(path: string): Command | Array<Command> | undefined {
		return super.getHookableByPath(path) as Command | Array<Command> | undefined;	
	}

	public registerCommand(path: string, hierarchical: boolean): Command | Array<Command> {
		if(!existsSync(path) || statSync(path).isDirectory()) { throw new InvalidCommandPathError(path); }

		let command: Command | Array<Command> | undefined;
		let commandName: string | undefined;

		if(hierarchical) {
			const hierarchicalCommand = CommandRegistry.importCommand(path, true) as HierarchicalCommand;
			commandName = hierarchicalCommand.data.name;
			
			if(hierarchicalCommand.execute) {
				command = hierarchicalCommand as Command;
			} else {
				command = [hierarchicalCommand as Command];
				const subcommandDirPath = path.replace(COMMAND_FILE_EXTENSION, "");
				const subcommandDirContents = readdirSync(subcommandDirPath);
				for(const subcommandName of subcommandDirContents) {
					const subcommandPath = join(subcommandDirPath, subcommandName);
					const subcommand = CommandRegistry.importCommand(subcommandPath, true);
					(command[0].data as SlashCommandBuilder).addSubcommand(subcommand.data as SlashCommandSubcommandBuilder);
					command.push(CommandRegistry.importCommand(subcommandPath, true));
				}
			}
		} else {
			command = CommandRegistry.importCommand(path, false);
			commandName = command.data.name;
		}

		if(this.getHookableByName(commandName) !== undefined) { 
			throw new DuplicateCommandError(path);
		} else {
			this.nameHookableMappings.set(commandName, command);
			this.pathNameMappings.set(path, commandName);
			return command;
		}
	}
}