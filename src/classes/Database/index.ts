import { Sequelize } from "sequelize";

export const database: Sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "session-reminder-app_db.sqlite",
	logging: false,
	define: { underscored: true }	
});