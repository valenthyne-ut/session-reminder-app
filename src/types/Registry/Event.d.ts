import { ClientEvents } from "discord.js";
import { ListenerExecute } from "./Hookable";

export interface Event extends Hookable {
	name: keyof ClientEvents;
	once: boolean;
	execute: ListenerExecute;
}