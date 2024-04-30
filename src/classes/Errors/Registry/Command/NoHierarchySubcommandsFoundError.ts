import { yellow } from "chalk";

export class NoHierarchySubcommandsFoundError extends Error {
	constructor(name: string) {
		super(`Hierarchy command ${yellow(name)} doesn't have any subcommands.`);
	}
}