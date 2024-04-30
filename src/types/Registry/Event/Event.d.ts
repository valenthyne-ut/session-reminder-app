import { Awaitable, ClientEvents } from "discord.js";

export type EventListenerFunction<Event extends keyof ClientEvents> =
	(...args: ClientEvents[Event]) => Awaitable<void>;

export interface Event {
	name: keyof ClientEvents;
	once: boolean;
	listener: EventListenerFunction<keyof ClientEvents>;
}