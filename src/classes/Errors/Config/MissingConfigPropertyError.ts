export class MissingConfigPropertyError extends Error {
	constructor(key: string) {
		super(`Missing config property "${key}".`);
	}
}