import { Client } from "discord.js";
import { ExtendedClientOptions } from "../../types/ExtendedClient/ExtendedClientOptions";

export class ExtendedClient extends Client {
	constructor(options: ExtendedClientOptions) {
		super(options);
	}
}