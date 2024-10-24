
export interface ISchedule {
  id?: string;
  name: string;
  receipts: any[];
  totalSpend?: number;
}

export class Schedule {
  // [x: string]: any;
  private _id?: string;
  private _name: string;
  private _receipts: any[];
  private _totalSpend?: number;

  private constructor(props: ISchedule) {
    this._id = props.id;
    this._name = props.name;
    this._totalSpend = props.totalSpend;
    this._receipts = props.receipts;
  }

  public static create(props: ISchedule): Schedule {
    return new Schedule(props);
  }

  public unmarshal(): ISchedule {
    return {
      id: this._id,
      name: this._name,
      totalSpend: this._totalSpend,
      receipts: this._receipts,
    };
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get receipts():any[] {
    return this._receipts;
  }

  get totalSpend(): number | undefined {
    return this._totalSpend;
  }
}
