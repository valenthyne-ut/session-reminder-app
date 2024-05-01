import { database } from "./classes/Database";
import { ExtendedClient } from "./classes/ExtendedClient";
import { logger } from "./classes/Logger";
import config from "./config";
import { formatUnwrappedError, unwrapError } from "./util/Errors";

void (async () => {
	await database.sync()
		.then(() => logger.info("Database ready."))
		.catch((error) => { 
			logger.fatal("Failed to initialize database. Exiting.");
			logger.fatal(formatUnwrappedError(unwrapError(error)));
			process.exit(1);
		});

	const client = new ExtendedClient({ 
		intents: [
			"Guilds",
			"GuildMessages"
		], 
		commandsPath: config.COMMANDS_PATH,
		eventsPath: config.EVENTS_PATH
	});

	await client.login(config.TOKEN);
})();