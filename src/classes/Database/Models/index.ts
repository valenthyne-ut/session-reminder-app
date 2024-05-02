import { Sequelize } from "sequelize";
import { Session } from "./Session";
import { ServerReminderConfig } from "./ServerReminderConfig";
import { Unit } from "./Unit";

export * from "./Session";
export * from "./ServerReminderConfig";
export * from "./Unit";

export function initModels(sequelize: Sequelize) {
	Session.initModel(sequelize);
	ServerReminderConfig.initModel(sequelize);
	Unit.initModel(sequelize);
}