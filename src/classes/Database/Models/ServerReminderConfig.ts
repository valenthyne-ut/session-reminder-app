import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class ServerReminderConfig extends Model<InferAttributes<ServerReminderConfig>, InferCreationAttributes<ServerReminderConfig>> {
	declare id: CreationOptional<number>;
	declare createdAt: CreationOptional<number>;
	declare updatedAt: CreationOptional<number>;

	declare serverId: string;
	declare channelId: string;
	declare roleId: string;

	public static initModel(sequelize: Sequelize): typeof ServerReminderConfig {
		return ServerReminderConfig.init({
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
			channelId: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			roleId: {
				type: DataTypes.TEXT,
				allowNull: false
			}
		}, { sequelize });
	};

	public static async existsFor(serverId: string): Promise<boolean> {
		return await ServerReminderConfig.findOne({ where: { serverId: serverId } }) !== undefined;
	}
}
