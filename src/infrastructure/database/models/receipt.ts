import { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { Grocery } from "./grocery";

export class Receipt extends Model<InferAttributes<Receipt>, InferCreationAttributes<Receipt>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare Groceries?: Grocery[];

  declare addGroceries : BelongsToManyAddAssociationsMixin<Grocery,string>
  declare addGrocery : BelongsToManyAddAssociationMixin<Grocery, string>
}

Receipt.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, { sequelize, tableName: "Receipts" });
