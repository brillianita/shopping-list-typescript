import { IReceipt, Receipt } from "../models/receipt";
import { IReceiptInput } from "../../dto/receipt-dto";

export interface ReceiptRepository {
    findAll(): Promise<Receipt[]>;
    findById(id: string): Promise<Receipt>;
    store(receipt: IReceiptInput): Promise<Receipt>;
    update(id: string, user: IReceiptInput): Promise<Receipt>;
    destroy(id: string): Promise<boolean>;
}
