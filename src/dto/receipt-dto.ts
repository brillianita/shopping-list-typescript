export interface IReceiptInput {
  id: string;
  name: string;
  groceries: {id: string, quantity: number}[];
}