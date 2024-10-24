
export interface ISchedule {
  id?: string;
  name: string;
  receipts: any[];
}

export class Schedule {
  private _id?: string;
  private _name: string;
  private _receipts: string[];

  private constructor(props: ISchedule) {
    this._id = props.id;
    this._name = props.name;
    this._receipts = props.receipts;
  }

  public static create(props: ISchedule): Schedule {
    return new Schedule(props);
  }

  public unmarshal(): ISchedule {
    return {
      id: this._id,
      name: this._name,
      receipts: this._receipts,
    };
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get receipts():string[] {
    return this._receipts;
  }
}
