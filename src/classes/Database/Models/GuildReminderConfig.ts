import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class GuildReminderConfig extends Model<InferAttributes<GuildReminderConfig>, InferCreationAttributes<GuildReminderConfig>> {
	declare id: CreationOptional<number>;
	declare createdAt: CreationOptional<number>;
	declare updatedAt: CreationOptional<number>;

	declare server_id: string;
	declare channel_id: string;
	declare role_id: string;

	public static initModel(sequelize: Sequelize): typeof GuildReminderConfig {
		return GuildReminderConfig.init({
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
			channel_id: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			role_id: {
				type: DataTypes.TEXT,
				allowNull: false
			}
		}, { sequelize });
	};

	public static async existsFor(guildId: string): Promise<boolean> {
		return await GuildReminderConfig.findOne({ where: { server_id: guildId } }) !== undefined;
	}
}
