import { Entity } from "./entity";

export interface IGroceryReceipt {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
}

export interface IReceipt {
  id?: string;
  name: string;
  groceries: IGroceryReceipt[];
}

export class Receipt extends Entity<IReceipt> {
  private constructor(props: IReceipt) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IReceipt): Receipt {
    const instance = new Receipt(props);
    return instance;
  }

  public unmarshal(): IReceipt {
    return {
      id: this._id,
      name: this.name,
      groceries: this.groceries, 
    };
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this.name; 
  }

  get groceries(): IGroceryReceipt[] {
    return this.groceries;  
  }
}
