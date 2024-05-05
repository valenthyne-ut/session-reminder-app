import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
	declare id: CreationOptional<number>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare serverId: string;
	declare dateTime: Date;
	declare reminderStage: CreationOptional<number>;

	static initModel(sequelize: Sequelize): typeof Session {
		return Session.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			createdAt: {
				type: DataTypes.DATE
			},
			updatedAt: {
				type: DataTypes.DATE
			},

			serverId: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			dateTime: {
				type: DataTypes.DATE,
				allowNull: false
			},
			reminderStage: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			}
		}, { sequelize });
	};
}