export enum Unit {
  kg = "kg",
  gram = "gram",
  liter = "liter",
  unit = "unit",
}

export interface IGrocery {
  id?: string;
  name: string;
  unit: string | Unit;
  price: number;
}

export class Grocery {
  private _id?: string;
  private _name: string;
  private _unit: string | Unit;
  private _price: number;

  private constructor(props: IGrocery) {
    this._id = props.id;
    this._name = props.name;
    this._unit = props.unit;
    this._price = props.price;
  }

  public static create(props: IGrocery): Grocery {
    const instance = new Grocery(props);
    return instance;
  }

  // Mengembalikan data entitas sebagai objek plain
  public unmarshal(): IGrocery {
    return {
      id: this._id,
      name: this._name,
      unit: this._unit,
      price: this._price,
    };
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get unit(): string | Unit {
    return this._unit;
  }

  get price(): number {
    return this._price;
  }

  // Setters (Jika diperlukan, tambahkan validasi)
  set name(value: string) {
    this._name = value;
  }

  set unit(value: string | Unit) {
    this._unit = value;
  }

  set price(value: number) {
    this._price = value;
  }
}
