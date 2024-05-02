import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
	declare id: CreationOptional<number>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare server_id: string;
	declare date_time: Date;
	declare reminder_sent: CreationOptional<boolean>;

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

			server_id: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			date_time: {
				type: DataTypes.DATE,
				allowNull: false
			},
			reminder_sent: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}, { sequelize });
	};
}