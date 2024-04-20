export class DuplicateEventError extends Error {
	constructor(path: string) {
		super(`Duplicate event at path "${path}".`);
	}
}