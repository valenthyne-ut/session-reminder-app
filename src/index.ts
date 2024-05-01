import { database } from "./classes/Database";
import { initModels } from "./classes/Database/Models";
import { ExtendedClient } from "./classes/ExtendedClient";
import { logger } from "./classes/Logger";
import config from "./config";
import { formatUnwrappedError, unwrapError } from "./util/Errors";

void (async () => {
	try {
		initModels(database);
		await database.sync();
		logger.info("Database ready.");
	} catch(error) {
		logger.fatal("Couldn't initialize database. Exiting.");
		logger.fatal(formatUnwrappedError(unwrapError(error)));
		process.exit(1);
	}

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