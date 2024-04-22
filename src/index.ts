import { ExtendedClient } from "./classes/ExtendedClient";
import config from "./config";

void (async () => {
	const client = new ExtendedClient({ 
		intents: [
			"Guilds"
		], 
		commandsPath: config.COMMANDS_PATH,
		eventsPath: config.EVENTS_PATH
	});

	await client.login(config.TOKEN);
})();