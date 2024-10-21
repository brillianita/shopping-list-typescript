import { Receipt, ReceiptGroceries } from "../models/receipt";
import { Grocery } from "../models/grocery";

interface IReceipt {
  id?: string;
  name: string;
  groceries: { id: string; quantity: number }[]; // Array of grocery ids and quantities
}

export class ReceiptSequelizeRepository {
  public async create(props: IReceipt): Promise<Receipt> {
    const { groceries, ...receiptProps } = props;

    const receipt = await Receipt.create(receiptProps);

    if (groceries && groceries.length) {
      for (const grocery of groceries) {
        await ReceiptGroceries.create({
          ReceiptId: receipt.id,
          GroceryId: grocery.id,
          quantity: grocery.quantity,
        });
      }
    }

    return receipt;
  }

  public async getAll(): Promise<Receipt[]> {
    return await Receipt.findAll({
      include: Grocery, // Including groceries
    });
  }

  public async getById(id: string): Promise<Receipt | null> {
    return await Receipt.findByPk(id, {
      include: Grocery, // Include groceries related to this receipt
    });
  }

  public async update(id: string, props: Partial<IReceipt>): Promise<[number, Receipt[]]> {
    const { groceries, ...receiptProps } = props;

    const updatedReceipt = await Receipt.update(receiptProps, {
      where: { id },
      returning: true
    });

    // If groceries array is provided, update the groceries in the pivot table
    if (groceries && groceries.length) {
      // First, delete all existing groceries for this receipt
      await ReceiptGroceries.destroy({ where: { ReceiptId: id } });

      // Then, add the new groceries
      for (const grocery of groceries) {
        await ReceiptGroceries.create({
          ReceiptId: id,
          GroceryId: grocery.id,
          quantity: grocery.quantity,
        });
      }
    }

    return updatedReceipt;
  }

  public async delete(id: string): Promise<number> {
    // Delete the receipt and its associated groceries from the pivot table
    await ReceiptGroceries.destroy({ where: { ReceiptId: id } });
    return await Receipt.destroy({ where: { id } });
  }
}
