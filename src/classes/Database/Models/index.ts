import { Sequelize } from "sequelize";
import { Session } from "./Session";
import { GuildReminderChannel } from "./GuildReminderChannel";

export * from "./Session";
export * from "./GuildReminderChannel";

export function initModels(sequelize: Sequelize) {
	Session.initModel(sequelize);
	GuildReminderChannel.initModel(sequelize);
}