import { Client } from "discord.js";
import { logger } from "../classes/Logger";
import { bgBlack } from "chalk";
import config from "../config";
import { CommandDeployer } from "../classes/ExtendedClient/CommandDeployer";
import { ExtendedClient } from "../classes/ExtendedClient";
import { SessionPoller } from "../classes/SessionPoller";

export const name = "ready";
export const once = true;
export function listener(client: Client) {
	logger.info(`${bgBlack(client.user?.tag)} ready!`);
	if(config.DEPLOY_COMMANDS) {
		void new CommandDeployer(client as ExtendedClient).deployCommands();
	}

	const extendedClient = client as ExtendedClient;
	extendedClient.sessionPoller = new SessionPoller(extendedClient);
}