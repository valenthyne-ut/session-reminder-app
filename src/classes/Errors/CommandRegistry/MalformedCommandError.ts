export class MalformedCommandError extends Error {
	constructor(path: string) {
		super(`Malformed command at path "${path}".`);
	}
}