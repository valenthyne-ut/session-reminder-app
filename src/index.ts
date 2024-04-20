import { Client } from "discord.js";
import { ExtendedClient } from "./classes/ExtendedClient";
import { logger } from "./classes/Logger";
import config from "./config";
import { bgBlack } from "chalk";

void (async () => {
	const client = new ExtendedClient({ 
		intents: [], 
		commandsPath: config.COMMANDS_PATH
	});

	client.once("ready", (client: Client) => {
		logger.info(`${bgBlack(client.user?.tag)} ready!`);
	});

	await client.login(config.TOKEN);
})();