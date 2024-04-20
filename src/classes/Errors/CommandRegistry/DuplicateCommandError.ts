export class DuplicateCommandError extends Error {
	constructor(path: string) {
		super(`Duplicate command at path "${path}".`);
	}
}