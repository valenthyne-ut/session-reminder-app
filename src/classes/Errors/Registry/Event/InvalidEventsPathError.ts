export class InvalidEventsPathError extends Error {
	constructor(path: string) {
		super(`Invalid events path at ${path}.`);
	}
}