import { Sequelize } from "sequelize";
import { Session } from "./Session";
import { ServerReminderConfig } from "./ServerReminderConfig";

export * from "./Session";
export * from "./ServerReminderConfig";

export function initModels(sequelize: Sequelize) {
	Session.initModel(sequelize);
	ServerReminderConfig.initModel(sequelize);
}