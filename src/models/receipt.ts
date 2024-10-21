import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import { Grocery } from "./grocery";

export class Receipt extends Model<InferAttributes<Receipt>, InferCreationAttributes<Receipt>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare Groceries?: Grocery[];
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

// Pivot Table ReceiptGroceries to manage many-to-many relationship
export class ReceiptGroceries extends Model<InferAttributes<ReceiptGroceries>, InferCreationAttributes<ReceiptGroceries>> {
  declare GroceryId: string;
  declare ReceiptId: string;
  declare quantity: number;  // How much of a grocery item is on this receipt
}

ReceiptGroceries.init({
  GroceryId: {
    type: DataTypes.STRING,
    references: {
      model: Grocery,
      key: 'id',
    }
  },
  ReceiptId: {
    type: DataTypes.STRING,
    references: {
      model: Receipt,
      key: 'id',
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { sequelize, tableName: "ReceiptGroceries" });

// Set up many-to-many relationship
Receipt.belongsToMany(Grocery, { through: ReceiptGroceries });
Grocery.belongsToMany(Receipt, { through: ReceiptGroceries });
