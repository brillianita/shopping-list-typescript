import { IGrocery, Grocery } from "../domain/models/grocery";
import { GroceryRepository } from "../domain/service/grocery-repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";

@injectable()
export class GroceryService {
  constructor(@inject(TYPES.GroceryRepository) private _repository: GroceryRepository) { }

  public async store(_grocery: IGrocery): Promise<IGrocery> {
    const groceryData = Grocery.create(_grocery);

    const grocery = await this._repository.store(
      Grocery.create({
        name: _grocery.name,
        unit: _grocery.unit,
        price: _grocery.price,
      })
    );
    return grocery.unmarshal();
  }

  public async findAll(): Promise<IGrocery[]> {
    const groceries = await this._repository.findAll();
    const groceryDto = groceries.map((grocery) => grocery.unmarshal());
    return groceryDto;
  }

  public async findById(id: string): Promise<IGrocery> {
    const grocery = await this._repository.findById(id);
    return grocery.unmarshal();
  }

  public async update(id: string, _grocery: IGrocery): Promise<IGrocery> {
    const toUpdateGrocery = Grocery.create({
      name: _grocery.name,
      unit: _grocery.unit,
      price: _grocery.price
    });
    const grocery = await this._repository.update(id, toUpdateGrocery);
    return grocery.unmarshal();
  }

  public async destroy(id: string): Promise<boolean> {
    await this._repository.destroy(id);
    return true;
  }
}