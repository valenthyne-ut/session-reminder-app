export class InvalidEventPathError extends Error {
	constructor(path: string) {
		super(`Invalid event path "${path}".`);
	}
}