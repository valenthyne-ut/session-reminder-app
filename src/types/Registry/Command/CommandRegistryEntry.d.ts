import { Command } from "./Command";
import { GuildDeployableCommand } from "./GuildDeployableCommand";

export interface CommandRegistryEntry {
	command: Command | GuildDeployableCommand;
	subcommands?: Array<Command>;
}