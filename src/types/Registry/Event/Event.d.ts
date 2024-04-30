import { Awaitable, ClientEvents } from "discord.js";

export interface DiscriminatedEvent<Name extends keyof ClientEvents> {
	name: Name;
	once: boolean;
	listener: (...args: ClientEvents[Name]) => Awaitable<void>;
}

export type Event = DiscriminatedEvent<keyof ClientEvents>;