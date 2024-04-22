export class MalformedEventError extends Error {
	constructor(path: string) {
		super(`Malformed event at path "${path}".`);
	}
}