import "dotenv/config";
import { MissingConfigPropertyError } from "../classes/Errors/Config";
import { join } from "path";

function getEnvVariable(key: string, required: boolean = false): string | undefined {
	const value = process.env[key];
	if(required && value === undefined) { throw new MissingConfigPropertyError(key); }
	return value;
}

function getDeployCommands(): boolean {
	const deployCommands = getEnvVariable("DEPLOY_COMMANDS");
	if(deployCommands && deployCommands === "true") { return true; }
	return false;
}

export default {
	TOKEN: getEnvVariable("TOKEN", true),
	COMMANDS_PATH: getEnvVariable("COMMANDS_PATH") || join(process.cwd(), "/dist/commands"),
	EVENTS_PATH: getEnvVariable("EVENTS_PATH") || join(process.cwd(), "/dist/events"),
	DEPLOY_COMMANDS: getDeployCommands()
};