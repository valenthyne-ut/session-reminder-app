import { Logger } from "../Logger";

export abstract class AbstractRegistry<T> {
	protected readonly logger: Logger;

	constructor(logger: Logger) {
		this.logger = logger;
	}

	public abstract fetchAll(): Array<T>;
	public abstract fetchByIdentifier(identifier: unknown): T | undefined;
	public abstract push(entry: T): void;
}