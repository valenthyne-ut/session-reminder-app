import { Client } from "discord.js";
import { logger } from "../classes/Logger";
import { bgBlack } from "chalk";

export const name = "ready";
export const once = true;
export function execute(client: Client) {
	logger.info(`${bgBlack(client.user?.tag)} ready!`);
}