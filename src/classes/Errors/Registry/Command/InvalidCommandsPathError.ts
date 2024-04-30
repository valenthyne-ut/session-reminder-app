export class InvalidCommandsPathError extends Error {
	constructor(path: string) {
		super(`Invalid commands path at ${path}.`);
	}
}