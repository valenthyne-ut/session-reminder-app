import { yellow } from "chalk";

export class InvalidCommandError extends Error {
	constructor(path: string, reason: string) {
		super(`Invalid command at path ${yellow(path)}. ${reason}`);
	}
}