import { ReceiptRepository } from "../../domain/service/receipt-repository";
import { Receipt } from "../../infrastructure/database/models/receipt";
import { Grocery } from "../../infrastructure/database/models/grocery";
import { Receipt as EntityReceipt, IReceipt } from "../../domain/models/receipt";
import { sequelize } from "../../infrastructure/database/sequelize";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { injectable } from "inversify";

@injectable()
export class ReceiptSequelizeRepository implements ReceiptRepository {

  public async store(receiptDomain: EntityReceipt): Promise<EntityReceipt> {
    const transaction = await sequelize.transaction();
    try {

      const receipt = await Receipt.create(
        {
          name: receiptDomain.name,
        },
        {
          transaction,
        }
      );

      const groceries = await Grocery.findAll({
        where: {
          id: receiptDomain.groceries.map((grocery) => grocery.id),
        },
        transaction,
      });

      const newGrocery = receiptDomain.groceries.map(grocery => {
        const matchingGrocery = groceries.find((g) => g.id === grocery.id);
        if (!matchingGrocery) {
          throw new AppError({
            statusCode: HttpCode.BAD_REQUEST,
            description: `Grocery with ID ${grocery.id} not found in the database.`,
          });
        } else {
          return { model: matchingGrocery, quantity: grocery.quantity };
        }
      });
      console.log(receipt instanceof Receipt);
      console.log(Object.keys(receipt))

      await Promise.all(newGrocery.map(async (grocery) => {
        try {
          console.log(`Adding grocery with ID ${grocery.model.id} and quantity ${grocery.quantity}`);
          receipt.addGrocery(grocery.model, {
            through: { quantity: grocery.quantity },
            transaction,
          });
          console.log(`Successfully added grocery with ID ${grocery.model.id} to the receipt`);
        } catch (error) {
          console.error(`Failed to add grocery with ID ${grocery.model.id}:`, error);
          throw new AppError({
            statusCode: HttpCode.BAD_REQUEST,
            description: `Failed to add grocery with ID ${grocery.model.id}.`,
            error,
          });
        }
      }));


      console.log('success?')


      await transaction.commit();

      const entity = EntityReceipt.create({
        id: receipt.id,
        name: receipt.name,
        groceries: receiptDomain.groceries,
      });

      return entity;
    } catch (e) {
      await transaction.rollback();
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create receipt",
        error: e,
      });
    }
  }

  public async findAll(): Promise<EntityReceipt[]> {
    try {
      const receipts = await Receipt.findAll({
        include: [{
          model: Grocery,
          through: { attributes: ['quantity'] }, // Ambil quantity dari tabel pivot ReceiptGroceries
        }],
      });
      return receipts.map((receipt) => {
        return EntityReceipt.create({
          id: receipt.id,
          name: receipt.name,
          groceries: receipt.Groceries?.map(grocery => ({
            id: grocery.id,
            name: grocery.name,
            unit: grocery.unit,
            price: grocery.price,
            quantity: (grocery as any).ReceiptGroceries.quantity  
          })) || [],
        });
      });
    } catch (e) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to fetch receipts",
        error: e,
      });
    }
  }

}
