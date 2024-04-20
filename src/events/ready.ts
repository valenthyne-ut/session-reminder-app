import { Client } from "discord.js";
import { logger } from "../classes/Logger";
import { bgBlack } from "chalk";
import config from "../config";
import { CommandDeployer } from "../classes/ExtendedClient/CommandDeployer";
import { ExtendedClient } from "../classes/ExtendedClient";

export const name = "ready";
export const once = true;
export function execute(client: Client) {
	logger.info(`${bgBlack(client.user?.tag)} ready!`);
	if(config.DEPLOY_COMMANDS) {
		void new CommandDeployer(client as ExtendedClient).deployCommands();
	}
}