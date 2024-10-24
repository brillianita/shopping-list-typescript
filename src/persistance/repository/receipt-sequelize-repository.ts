import { ReceiptRepository } from "../../domain/service/receipt-repository";
import { Receipt, Grocery } from "../../infrastructure/database/models";
import { Receipt as EntityReceipt, IReceipt } from "../../domain/models/receipt";
import { sequelize } from "../../infrastructure/database/sequelize";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { injectable } from "inversify";

@injectable()
export class ReceiptSequelizeRepository implements ReceiptRepository {

  public async store(receiptDomain: EntityReceipt): Promise<EntityReceipt> {
    const transaction = await sequelize.transaction();
    try {
      // Membuat entitas receipt
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
            description: `Grocery with ID ${grocery.id} not found in database.`,
          });
        } else {
          return { model: matchingGrocery, quantity: grocery.quantity };
        }
      });

      await Promise.all(newGrocery.map(async (grocery) => {
        console.log(`Adding grocery with ID ${grocery.model.id} and quantity ${grocery.quantity}`);
        return receipt.addGrocery(grocery.model, {
          through: { quantity: grocery.quantity },
          transaction,
        });
      }));

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
          through: { attributes: ['quantity'] },
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



  public async findById(id: string): Promise<EntityReceipt> {
    try {
      const receipt = await Receipt.findByPk(id, {
        include: [{
          model: Grocery,
          through: { attributes: ['quantity'] }, 
        }],
      });
  
    
      if (!receipt) {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: `Receipt with ID ${id} not found`,
        });
      }
  
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
    } catch (e) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to fetch receipt",
        error: e,
      });
    }
  }
  

}
