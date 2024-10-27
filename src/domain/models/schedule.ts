import { Entity } from "./entity";
import { IReceipt } from "./receipt";

export interface ISchedule {
  id?: string;
  name: string;
  totalSpend?: number;
  receipts: IReceipt[];
}

export class Schedule extends Entity<ISchedule> {
  private constructor(props: ISchedule) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: ISchedule): Schedule {
    return new Schedule(props);
  }

  public unmarshal(): ISchedule {
    return {
      id: this._id,
      name: this.name,
      totalSpend: this.calculateTotalSpend(),
      receipts: this.receipts,
    };
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get receipts(): IReceipt[] {
    return this.props.receipts;
  }

  // Method to calculate totalSpend
  private calculateTotalSpend(): number {
    return this.receipts.reduce((total, receipt) => {
      return total + receipt.groceries.reduce((sum, grocery) => {
        return sum + (grocery.price * grocery.quantity);
      }, 0);
    }, 0);
  }
}
