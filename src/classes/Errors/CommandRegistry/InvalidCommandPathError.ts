export class InvalidCommandPathError extends Error {
	constructor(path: string) {
		super(`Invalid command path "${path}".`);
	}
}