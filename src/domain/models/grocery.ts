import { Entity } from "./entity";

export enum EUnit {
  kg = "kg",
  gram = "gram",
  liter = "liter",
  unit = "unit",
}

export interface IGrocery {
  id?: string;
  name: string;
  unit: string | EUnit;
  price: number;
}

export class Grocery extends Entity<IGrocery> {
  private constructor(props: IGrocery) {
    const { id, ...data } = props;
    super(data, id);
  }


  public static create(props: IGrocery): Grocery {
    const instance = new Grocery(props);
    return instance;
  }

  public unmarshal(): IGrocery {
    return {
      id: this._id,
      name: this.name,
      unit: this.unit,
      price: this.price,
    };
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get unit(): string | EUnit {
    return this.props.unit;
  }

  get price(): number {
    return this.props.price;
  }
}
