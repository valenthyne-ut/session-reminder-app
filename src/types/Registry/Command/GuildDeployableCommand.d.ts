import { Command } from "./Command";

export interface GuildDeployableCommand extends Command {
	guilds: Array<string>;
}