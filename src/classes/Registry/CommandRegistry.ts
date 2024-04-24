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

const COMMAND_FILE_EXTENSION = ".js";

export class CommandRegistry extends HookableRegistry {
	constructor(commandsPath: string, logger?: Logger, verbose?: boolean) {
		super(logger || new Logger("CommandRegistry"), verbose);
		
		if(!existsSync(commandsPath) || statSync(commandsPath).isFile()) {
			throw new InvalidCommandsPathError(commandsPath);
		}

		const candidateCommands: Array<CandidateCommand> = [];
		function pushCandidate(filename: string, path: string) {
			if(!filename.endsWith(COMMAND_FILE_EXTENSION)) { return; };
			
			candidateCommands.push({
				filename: filename,
				path: path
			});
		}

		const commandsPathItems = readdirSync(commandsPath);
		for(const itemName of commandsPathItems) {
			const itemPath = join(commandsPath, itemName);
			if(statSync(itemPath).isDirectory()) {
				const groupPathContents = readdirSync(itemPath);
				for(const groupItemName of groupPathContents) {
					const groupItemPath = join(itemPath, groupItemName);
					if(statSync(groupItemPath).isFile()) { pushCandidate(groupItemName, groupItemPath); }
				}
			} else {
				pushCandidate(itemName, itemPath);
			}
		}

		let registeredCount = 0;
		for(const candidate of candidateCommands) { 
			const { filename, path } = candidate;
			try {
				this.registerCommand(path);
				registeredCount++;
			} catch(error) {
				this.logger.error(formatUnwrappedError(unwrapError(error)), false);
			}
		}

		this.logger.info(`Registered ${yellow(registeredCount)} command(s) in total.`);
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

		if(this.getHookableByName(commandName) !== undefined) { 
			throw new DuplicateCommandError(path);
		} else {
			this.nameHookableMappings.set(commandName, command);
			this.pathNameMappings.set(path, commandName);
			return command;
		}
	}
}