import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";

export class ReceiptGroceries extends Model<InferAttributes<ReceiptGroceries>, InferCreationAttributes<ReceiptGroceries>> {
  declare GroceryId: string;
  declare ReceiptId: string;
  declare quantity: number;
}

ReceiptGroceries.init({
  GroceryId: {
    type: DataTypes.STRING,
    references: {
      model: 'Groceries',
      key: 'id',
    }
  },
  ReceiptId: {
    type: DataTypes.STRING,
    references: {
      model: 'Receipts',
      key: 'id',
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { sequelize, tableName: "ReceiptGroceries" });
