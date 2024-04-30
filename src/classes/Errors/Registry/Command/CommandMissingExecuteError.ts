export class CommandMissingExecuteError extends Error {
	constructor(commandName: string) {
		super(`Command named ${commandName} is missing an execute function.`);
	}
}