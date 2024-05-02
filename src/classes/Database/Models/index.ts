import { Sequelize } from "sequelize";
import { Session } from "./Session";
import { GuildReminderConfig } from "./GuildReminderConfig";

export * from "./Session";
export * from "./GuildReminderConfig";

export function initModels(sequelize: Sequelize) {
	Session.initModel(sequelize);
	GuildReminderConfig.initModel(sequelize);
}