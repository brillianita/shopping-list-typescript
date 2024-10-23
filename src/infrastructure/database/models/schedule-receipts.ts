import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { Receipt } from "./receipt";
import { Schedule } from "./schedule";

export class ScheduleReceipts extends Model<InferAttributes<ScheduleReceipts>, InferCreationAttributes<ScheduleReceipts>> {
  declare ScheduleId: string;
  declare ReceiptId: string;
}

ScheduleReceipts.init({
  ScheduleId: {
    type: DataTypes.STRING,
    references: {
      model: Schedule,
      key: 'id',
    }
  },
  ReceiptId: {
    type: DataTypes.STRING,
    references: {
      model: Receipt,
      key: 'id',
    }
  }
}, { sequelize, tableName: "ScheduleReceipts" });
