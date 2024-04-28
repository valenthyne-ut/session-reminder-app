import { Hookable, InteractionsExecute } from "./Hookable";
import { CommandBuilders } from "./Command";

export interface HierarchicalCommand extends Hookable {
	data: CommandBuilders;
	guilds: Array<string>;
	execute?: InteractionsExecute;
}