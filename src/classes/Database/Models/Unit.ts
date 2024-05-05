import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Unit extends Model<InferAttributes<Unit>, InferCreationAttributes<Unit>> {
	declare id: CreationOptional<number>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare serverId: string;
	declare name: string;
	declare length: number;

	static initModel(sequelize: Sequelize): typeof Unit {
		return Unit.init({
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
			name: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			length: {
				type: DataTypes.NUMBER,
				allowNull: false
			}
		}, { sequelize });
	}
}