import { IReceipt, Receipt } from "../domain/models/receipt";
import { ReceiptRepository } from "../domain/service/receipt-repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { AppError, HttpCode } from "../libs/exceptions/app-error";

@injectable()
export class ReceiptService {
  constructor(@inject(TYPES.ReceiptRepository) private _repository: ReceiptRepository) { }

  public async store(_receipt: IReceipt): Promise<IReceipt> {
    try {
      const receiptData = Receipt.create(_receipt);
      console.log("Receipt data:", receiptData);
      const receipt = await this._repository.store(receiptData);
      console.log("Receipt stored:", receipt);

      return receipt.unmarshal();
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to store receipt",
        error,
      });
    }
  }

  public async findAll(): Promise<IReceipt[]> {
    try {
      const receipts = await this._repository.findAll(); // Mengambil semua receipt melalui repository
      console.log("Receipts fetched:", receipts);

      // Mengembalikan semua receipt dalam bentuk IReceipt setelah unmarshaling
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
      const receipt = await this._repository.findById(receiptId);
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

  public async update(receiptId: string, updatedReceipt: IReceipt): Promise<IReceipt> {
    try {
      const receipt = await this._repository.findById(receiptId);
      if (!receipt) {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: `Receipt with ID ${receiptId} not found`,
        });
      }

      const updated = await this._repository.update(receiptId, Receipt.create(updatedReceipt));
      console.log("Receipt updated:", updated);

      return updated.unmarshal();
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: `Failed to update receipt with ID ${receiptId}`,
        error,
      });
    }
  }

  public async destroy(id: string): Promise<boolean> {
    try {
      const receipt = await this._repository.findById(id);
      if (!receipt) {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: `Receipt with ID ${id} not found`,
        });
      }

      await this._repository.destroy(id);

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