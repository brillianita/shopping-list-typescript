import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "./sequelize";

export enum unit {
  kg = 'kg',
  gram = 'gram',
  liter = 'liter',
  unit = 'unit',
}

export class Grocery extends Model<InferAttributes<Grocery>, InferCreationAttributes<Grocery>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare unit: unit;
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
    type: DataTypes.ENUM(...Object.values(unit)),
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, { sequelize, tableName: "Groceries" });
