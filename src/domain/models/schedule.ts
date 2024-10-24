// export interface IReceipt {
//   id?: string;
//   name: string;
//   receipts: {id: string; quantity: number}[];
// }

// export class Receipt {
//   private _id?: string;
//   private _name: string;
//   private _groceries: { id: string; quantity: number}[];

//   private constructor(props: IReceipt) {
//     this._id = props.id;
//     this._name = props.name;
//     this._groceries = props.groceries;
//   }

//   public static create(props: IReceipt): Receipt {
//     const instance = new Receipt(props);
//     return instance;
//   }

//   public unmarshal(): IReceipt {
//     return {
//       id: this._id,
//       name: this._name,
//       groceries: this._groceries,
//     };
//   }

//   get id(): string | undefined {
//     return this._id;
//   }

//   get name(): string {
//     return this._name;
//   }
  
//   get groceries(): {id: string; quantity: number}[] {
//     return this._groceries;
//   }
// }
