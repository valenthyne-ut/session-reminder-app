import { ExtendedClient } from "./classes/ExtendedClient";
import { logger } from "./classes/Logger";
import config from "./config";
import { bgBlack } from "chalk";

void (async () => {
	const client = new ExtendedClient({ intents: [] });

	client.once("ready", (client: ExtendedClient) => {
		logger.info(`${bgBlack(client.user?.tag)} ready!`);
	});

	await client.login(config.TOKEN);
})();