import { Routes } from "discord.js";
import { Logger } from "../Logger";
import { ExtendedClient } from "./ExtendedClient";
import { yellow } from "chalk";
import { formatUnwrappedError, unwrapError } from "../../util/Errors";
import { GuildDeployableCommand } from "../../types/Registry/Command";

export class CommandDeployer {
	private client: ExtendedClient;
	private logger: Logger;

	constructor(client: ExtendedClient) {
		this.client = client;
		this.logger = new Logger("CommandDeployer");
	}

	async deployCommands() {
		const userId = this.client.user?.id;

		if(userId) {
			const commands = this.client.commandRegistry.fetchAll().map(entry => entry.command);
			const guildDeployableCommands = commands.filter(command => (command as GuildDeployableCommand).guilds !== undefined) as Array<GuildDeployableCommand>;

			const guildIds = this.client.guilds.cache.map(guild => guild.id);

			for(const guildId of guildIds) {
				const guildName = this.client.guilds.cache.find(guild => guild.id === guildId)?.name || "Unknown";
				const guildCommands = guildDeployableCommands.filter(command => command.guilds.includes(guildId) || command.guilds.length == 0);

				try {
					await this.client.rest.put(Routes.applicationGuildCommands(userId, guildId), { body: guildCommands.map(command => command.data.toJSON()) });
					this.logger.info(`Deployed ${yellow(guildCommands.length)} out of ${yellow(commands.length)} commands to guild ${yellow(guildName)}.`);
				} catch(error) {
					this.logger.error(`Failed to deploy commands to guild ${yellow(guildName)}`);
					this.logger.error(formatUnwrappedError(unwrapError(error)));
				}
			}
		}
	}
}