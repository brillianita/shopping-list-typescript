import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { Unit } from "../../../domain/models/grocery";

export class Grocery extends Model<InferAttributes<Grocery>, InferCreationAttributes<Grocery>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare unit: Unit;
  declare price: number;
}

Grocery.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, { sequelize, tableName: "Groceries" });
