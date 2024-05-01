import { Sequelize } from "sequelize";
import { Session } from "./Session";

export * from "./Session";

export function initModels(sequelize: Sequelize) {
	Session.initModel(sequelize);
}