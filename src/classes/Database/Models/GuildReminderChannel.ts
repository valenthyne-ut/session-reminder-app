import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class GuildReminderChannel extends Model<InferAttributes<GuildReminderChannel>, InferCreationAttributes<GuildReminderChannel>> {
	declare id: CreationOptional<number>;
	declare createdAt: CreationOptional<number>;
	declare updatedAt: CreationOptional<number>;

	declare server_id: string;
	declare channel_id: string;

	static initModel(sequelize: Sequelize): typeof GuildReminderChannel {
		return GuildReminderChannel.init({
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
			}
		}, { sequelize });
	};

	static async assignGuildReminderChannel(server_id: string, channel_id: string, override?: true) {
		const channel = await GuildReminderChannel.findOne({ where: { server_id: server_id } });
		
		if(channel && !override) { return; }
		else if(channel && override) {
			await channel.update("channel_id", channel_id);
		} else {
			await GuildReminderChannel.create({
				server_id: server_id,
				channel_id: channel_id
			});
		}
	}
}
