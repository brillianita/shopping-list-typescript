export interface IReceiptInput {
  name: string;
  groceries: {id: string, quantity: number}[];
}