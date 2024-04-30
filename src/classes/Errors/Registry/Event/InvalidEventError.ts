import { yellow } from "chalk";

export class InvalidEventError extends Error {
	constructor(path: string, reason: string) {
		super(`Invalid event at path ${yellow(path)}. ${reason}`);
	}
}