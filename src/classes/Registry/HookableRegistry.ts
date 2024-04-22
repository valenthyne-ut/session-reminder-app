import { Hookable } from "../../types/Registry";
import { Logger } from "../Logger";

export abstract class HookableRegistry {
	protected readonly nameHookableMappings: Map<string, Hookable>;
	protected readonly pathNameMappings: Map<string, string>;

	public readonly logger: Logger;
	public readonly verbose: boolean;

	constructor(logger: Logger, verbose: boolean = true) {
		this.nameHookableMappings = new Map();
		this.pathNameMappings = new Map();
		
		this.logger = logger;
		this.verbose = verbose;
	}

	public getHookables(): Array<Hookable> {
		return Array.from(this.nameHookableMappings.values());
	}

	public getHookableByName(name: string): Hookable | undefined {
		return this.nameHookableMappings.get(name);		
	}

	public getHookableByPath(path: string): Hookable | undefined {
		const name = this.pathNameMappings.get(path);
		if(name) { return this.nameHookableMappings.get(name); } 
		return undefined;
	}
}