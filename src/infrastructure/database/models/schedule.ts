import { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyRemoveAssociationsMixin, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { Receipt } from "./receipt";

export class Schedule extends Model<InferAttributes<Schedule>, InferCreationAttributes<Schedule>> {
  declare id?: CreationOptional<string>;
  declare name: string; 
  declare Receipts?: Receipt[];

  declare addReceipts : BelongsToManyAddAssociationsMixin<Receipt,string>
  declare addReceipt : BelongsToManyAddAssociationMixin<Receipt, string>
  declare removeReceipts: BelongsToManyRemoveAssociationsMixin<Receipt, string>;
}

Schedule.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, { sequelize, tableName: "Schedules" });


