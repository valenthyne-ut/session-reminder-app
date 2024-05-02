import { Sequelize } from "sequelize";
import { Session } from "./Session";
import { GuildReminderInfo } from "./GuildReminderInfo";

export * from "./Session";
export * from "./GuildReminderInfo";

export function initModels(sequelize: Sequelize) {
	Session.initModel(sequelize);
	GuildReminderInfo.initModel(sequelize);
}