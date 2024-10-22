import { Grocery, unit } from "../../infrastructure/database/models/grocery";

interface IGrocery {
  id?: string;
  name: string;
  unit: unit;
  price: number;
}

export class GrocerySequelizeRepository {
  public async create(props: IGrocery): Promise<Grocery> {
    const createdGrocery = await Grocery.create(props);
    return createdGrocery;
  }

  public async getAll(): Promise<Grocery[]> {
    return await Grocery.findAll();
  }

  public async getById(id: string): Promise<Grocery | null> {
    return await Grocery.findByPk(id);
  }

  public async update(id: string, props: Partial<IGrocery>): Promise<[number, Grocery[]]> {
    return await Grocery.update(props, {
      where: { id },
      returning: true
    });
  }

  public async delete(id: string): Promise<number> {
    return await Grocery.destroy({
      where: { id }
    });
  }
}
