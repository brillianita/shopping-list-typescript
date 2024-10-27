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
      const groceryDetails = await this._groceryRepository.findByIds(
        receiptData.groceries.map(g => g.id)
      );

      // Check if all groceries in the request exist in the database
      if (groceryDetails.length !== receiptData.groceries.length) {
        throw new AppError({
          statusCode: HttpCode.BAD_REQUEST,
          description: "Some groceries in the request were not found.",
        });
      }

      // Build the full receipt data with grocery details and quantities
      const fullReceiptData: IReceipt = {
        name: receiptData.name,
        groceries: groceryDetails.map(grocery => {
          const inputGrocery = receiptData.groceries.find(g => g.id === grocery.id);
          return {
              id: grocery.id,
              name: grocery.name,
              unit: grocery.unit,
              price: grocery.price,
              quantity: inputGrocery ? inputGrocery.quantity : 0,
          } as IGroceryReceipt;
      }),
      };
    
      // Create a domain entity from the full receipt data
      const receiptDomain = Receipt.create(fullReceiptData);
      console.log("Receipt data to store:", receiptDomain);

      // Store the receipt using the repository
      const storedReceipt = await this._receiptRepository.store(receiptDomain);
      console.log("Receipt successfully stored:", storedReceipt);

      // Return the stored receipt in a standard format
      return storedReceipt.unmarshal();
  }

  // public async findAll(): Promise<IReceipt[]> {
  //   try {
  //     const receipts = await this._repository.findAll(); // Mengambil semua receipt melalui repository
  //     console.log("Receipts fetched:", receipts);

  //     // Mengembalikan semua receipt dalam bentuk IReceipt setelah unmarshaling
  //     return receipts.map(receipt => receipt.unmarshal());
  //   } catch (error) {
  //     throw new AppError({
  //       statusCode: HttpCode.INTERNAL_SERVER_ERROR,
  //       description: "Failed to fetch receipts",
  //       error,
  //     });
  //   }
  // }

  // public async findById(receiptId: string): Promise<IReceipt> {
  //   try {
  //     const receipt = await this._repository.findById(receiptId);
  //     if (!receipt) {
  //       throw new AppError({
  //         statusCode: HttpCode.NOT_FOUND,
  //         description: `Receipt with ID ${receiptId} not found`,
  //       });
  //     }

  //     console.log("Receipt fetched:", receipt);

  //     return receipt.unmarshal();
  //   } catch (error) {
  //     throw new AppError({
  //       statusCode: HttpCode.INTERNAL_SERVER_ERROR,
  //       description: `Failed to fetch receipt with ID ${receiptId}`,
  //       error,
  //     });
  //   }
  // }

  // public async update(receiptId: string, updatedReceipt: IReceipt): Promise<IReceipt> {
  //   try {
  //     const receipt = await this._repository.findById(receiptId);
  //     if (!receipt) {
  //       throw new AppError({
  //         statusCode: HttpCode.NOT_FOUND,
  //         description: `Receipt with ID ${receiptId} not found`,
  //       });
  //     }

  //     const updated = await this._repository.update(receiptId, Receipt.create(updatedReceipt));
  //     console.log("Receipt updated:", updated);

  //     return updated.unmarshal();
  //   } catch (error) {
  //     throw new AppError({
  //       statusCode: HttpCode.INTERNAL_SERVER_ERROR,
  //       description: `Failed to update receipt with ID ${receiptId}`,
  //       error,
  //     });
  //   }
  // }

  // public async destroy(id: string): Promise<boolean> {
  //   try {
  //     const receipt = await this._repository.findById(id);
  //     if (!receipt) {
  //       throw new AppError({
  //         statusCode: HttpCode.NOT_FOUND,
  //         description: `Receipt with ID ${id} not found`,
  //       });
  //     }

  //     await this._repository.destroy(id);

  //     console.log(`Receipt with ID ${id} deleted successfully.`);
  //     return true;
  //   } catch (error) {
  //     throw new AppError({
  //       statusCode: HttpCode.INTERNAL_SERVER_ERROR,
  //       description: `Failed to delete receipt with ID ${id}`,
  //       error,
  //     });
  //   }
  // }


}