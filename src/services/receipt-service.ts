import { IGroceryReceipt, IReceipt, Receipt } from "../domain/models/receipt";
import { ReceiptRepository } from "../domain/service/receipt-repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { AppError, HttpCode } from "../libs/exceptions/app-error";
import { IReceiptInput } from "../dto/receipt-dto";
import { GroceryRepository } from "../domain/service/grocery-repository";

@injectable()
export class ReceiptService {
  constructor(
    @inject(TYPES.ReceiptRepository) private _receiptRepository: ReceiptRepository,
    @inject(TYPES.GroceryRepository) private _groceryRepository: GroceryRepository
  ) { }

  public async store(receiptData: IReceiptInput): Promise<IReceipt> {
    // Fetch all groceries based on IDs from the request
    const groceryDetails = await this._groceryRepository.findByIds(
      receiptData.groceries.map(g => g.id)
    );

    const groceryMap: { [key: string]: IGroceryReceipt } = {};
    groceryDetails.forEach(grocery => {
      groceryMap[grocery.id as string] = {
        id: grocery.id as string,
        name: grocery.name,
        unit: grocery.unit,
        price: grocery.price,
        quantity: 0
      };
    });

    if (Object.keys(groceryMap).length !== receiptData.groceries.length) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Some groceries in the request were not found.",
      });
    }

    receiptData.groceries.forEach(groceryInput => {
      if (groceryMap[groceryInput.id]) {
        groceryMap[groceryInput.id].quantity = groceryInput.quantity;
      }
    });

    const fullReceiptData: IReceipt = {
      name: receiptData.name,
      groceries: Object.values(groceryMap)
    };

    const receiptDomain = Receipt.create(fullReceiptData);
    console.log("Receipt data to store:", receiptDomain);

    const storedReceipt = await this._receiptRepository.store(receiptDomain);
    console.log("Receipt successfully stored:", storedReceipt);

    return storedReceipt.unmarshal();
  }


  public async findAll(): Promise<IReceipt[]> {
    try {
      const receipts = await this._receiptRepository.findAll(); 

      return receipts.map(receipt => receipt.unmarshal());
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to fetch receipts",
        error,
      });
    }
  }

  public async findById(receiptId: string): Promise<IReceipt> {
    try {
      const receipt = await this._receiptRepository.findById(receiptId);
      if (!receipt) {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: `Receipt with ID ${receiptId} not found`,
        });
      }

      console.log("Receipt fetched:", receipt);

      return receipt.unmarshal();
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: `Failed to fetch receipt with ID ${receiptId}`,
        error,
      });
    }
  }

  public async update(id: string, receiptData: IReceiptInput): Promise<IReceipt> {
    const existingReceipt = await this._receiptRepository.findById(id);
    if (!existingReceipt) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: `Receipt with ID ${id} not found.`,
      });
    }

    const groceryDetails = await this._groceryRepository.findByIds(
      receiptData.groceries.map(g => g.id)
    );

    if (groceryDetails.length !== receiptData.groceries.length) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Some groceries in the request were not found.",
      });
    }

    const groceryMap: { [key: string]: IGroceryReceipt } = {};
    groceryDetails.forEach(grocery => {
      groceryMap[grocery.id as string] = {
        id: grocery.id as string,
        name: grocery.name,
        unit: grocery.unit,
        price: grocery.price,
        quantity: receiptData.groceries.find(g => g.id === grocery.id)?.quantity || 0
      };
    });

    const fullReceiptData: IReceipt = {
      id,
      name: receiptData.name,
      groceries: Object.values(groceryMap)
    };

    const receiptDomain = Receipt.create(fullReceiptData);
    console.log("Receipt data to update:", receiptDomain);

    const updatedReceipt = await this._receiptRepository.update(id, receiptDomain);
    console.log("Receipt successfully updated:", updatedReceipt);

    return updatedReceipt.unmarshal();
  }

  public async destroy(id: string): Promise<boolean> {
    try {
      const receipt = await this._receiptRepository.findById(id);
      if (!receipt) {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: `Receipt with ID ${id} not found`,
        });
      }

      await this._receiptRepository.destroy(id);

      console.log(`Receipt with ID ${id} deleted successfully.`);
      return true;
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: `Failed to delete receipt with ID ${id}`,
        error,
      });
    }
  }


}