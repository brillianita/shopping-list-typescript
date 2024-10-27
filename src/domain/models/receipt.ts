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
    return new Receipt(props);
  }

  public unmarshal(): IReceipt {
    return {
      id: this._id,
      name: this.name,
      groceries: this.groceries,
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get groceries(): IGroceryReceipt[] {
    return this.props.groceries;
  }
}
