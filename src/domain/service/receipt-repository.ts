import { IReceipt, Receipt } from "../models/receipt";

export interface ReceiptRepository {
    findAll(): Promise<Receipt[]>;
    findById(id: string): Promise<Receipt>;
    store(receipt: IReceipt): Promise<Receipt>;
    update(id: string, user: IReceipt): Promise<Receipt>;
    destroy(id: string): Promise<boolean>;
}
