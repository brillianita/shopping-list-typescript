import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import { Receipt } from "./receipt";

export class Schedule extends Model<InferAttributes<Schedule>, InferCreationAttributes<Schedule>> {
  declare id: CreationOptional<string>;
  declare name: string; 
  declare Receipts?: Receipt[];
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

// Pivot Table ScheduleReceipts to manage many-to-many relationship
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

// Set up many-to-many relationship
Schedule.belongsToMany(Receipt, { through: ScheduleReceipts });
Receipt.belongsToMany(Schedule, { through: ScheduleReceipts });
