import { ReceiptRepository } from "../../domain/service/receipt-repository";
import { Receipt, Grocery } from "../../infrastructure/database/models";
import { Receipt as EntityReceipt, IReceipt } from "../../domain/models/receipt";
import { sequelize } from "../../infrastructure/database/sequelize";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { injectable } from "inversify";
import { IReceiptInput } from "../../dto/receipt-dto";

@injectable()
export class ReceiptSequelizeRepository implements ReceiptRepository {

  public async store(receiptDomain: IReceiptInput): Promise<EntityReceipt> {
    const transaction = await sequelize.transaction();
    try {
      const receipt = await Receipt.create(
        { name: receiptDomain.name },
        { transaction }
      );

      const groceries = await Grocery.findAll({
        where: {
          id: receiptDomain.groceries.map((grocery) => grocery.id),
        },
        transaction,
      });

      const newGroceries = receiptDomain.groceries.map(groceryInput => ({
        model: groceries.find(g => g.id === groceryInput.id)!,
        quantity: groceryInput.quantity,
      }));

      await Promise.all(newGroceries.map(async (grocery) => {
        console.log(`Adding grocery with ID ${grocery.model.id} and quantity ${grocery.quantity}`);
        return receipt.addGrocery(grocery.model, {
          through: { quantity: grocery.quantity },
          transaction,
        });
      }));

      await transaction.commit();

      const receiptWithGroceries = await Receipt.findByPk(receipt.id, {
        include: [{
          model: Grocery,
          through: { attributes: ['quantity'] }
        }]
      });
      if (!receiptWithGroceries) {
        throw new AppError({
          statusCode: HttpCode.INTERNAL_SERVER_ERROR,
          description: "Failed to retrieve the receipt after creation."
        });
      }
      const entity = EntityReceipt.create({
        id: receiptWithGroceries.id,
        name: receiptWithGroceries.name,
        groceries: receiptWithGroceries.Groceries?.map(grocery => ({
          id: grocery.id,
          name: grocery.name,
          unit: grocery.unit,
          price: grocery.price,
          quantity: (grocery as any).ReceiptGroceries.quantity
        })) || [],
      });

      return entity;

    } catch (error) {
      await transaction.rollback();
      console.error("Error details:", error); // Log the full error details
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to store receipt",
        error,
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

  public async update(id: string, receiptData: IReceiptInput): Promise<EntityReceipt> {
    const transaction = await sequelize.transaction();
    try {
      const receipt = await Receipt.findByPk(id, { transaction });

      await receipt?.update({ name: receiptData.name }, { transaction });

      const existingGroceries = await receipt?.getGroceries({ transaction });
      console.log('existing groceries receipt seq rep', existingGroceries)
      if (existingGroceries) {
        await receipt?.removeGroceries(existingGroceries, { transaction });
      }

      const groceryDetails = await Grocery.findAll({
        where: {
          id: receiptData.groceries.map(grocery => grocery.id),
        },
        transaction,
      });

      const groceryMap = new Map<string, { model: Grocery; quantity: number }>();
      groceryDetails.forEach(grocery => {
        groceryMap.set(grocery.id, {
          model: grocery,
          quantity: receiptData.groceries.find(g => g.id === grocery.id)?.quantity || 0,
        });
      });

      for (const { model, quantity } of groceryMap.values()) {
        await receipt?.addGrocery(model, { through: { quantity }, transaction });
      }

      await transaction.commit();

      const updatedReceipt = await Receipt.findByPk(receipt?.id, {
        include: [{
          model: Grocery,
          through: { attributes: ['quantity'] },
        }],
      });

      if (!updatedReceipt) {
        throw new AppError({
          statusCode: HttpCode.INTERNAL_SERVER_ERROR,
          description: "Failed to retrieve the receipt after creation."
        });
      }

      const entity = EntityReceipt.create({
        id: updatedReceipt?.id,
        name: updatedReceipt?.name,
        groceries: updatedReceipt?.Groceries?.map(grocery => ({
          id: grocery.id,
          name: grocery.name,
          unit: grocery.unit,
          price: grocery.price,
          quantity: (grocery as any).ReceiptGroceries.quantity,
        })) || [],
      });

      return entity;

    } catch (error) {
      await transaction.rollback();
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to update receipt",
        error,
      });
    }
  }



  // async destroy(id: string): Promise<boolean> {
  //   const transaction = await sequelize.transaction(); 
  //   try {
  //     const receipt = await Receipt.findByPk(id, {
  //       include: [Grocery],
  //       transaction,
  //     });

  //     if (!receipt) {
  //       throw new AppError({
  //         statusCode: HttpCode.NOT_FOUND,
  //         description: "Receipt was not found",
  //       });
  //     }

  //     if (receipt.Groceries && receipt.Groceries.length > 0) {
  //       await receipt.removeGroceries(receipt.Groceries, { transaction });
  //     }

  //     await receipt.destroy({ transaction });

  //     await transaction.commit();
  //     return true;
  //   } catch (error) {
  //     await transaction.rollback(); 
  //     throw new AppError({
  //       statusCode: HttpCode.INTERNAL_SERVER_ERROR,
  //       description: "Failed to delete receipt",
  //       error,
  //     });
  //   }
  // }

}
