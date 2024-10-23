import { GroceryRepository } from "../../domain/service/grocery-repository";
import { Grocery } from "../../infrastructure/database/models/grocery";
import { Grocery as EntityGrocery, IGrocery, Unit } from "../../domain/models/grocery";
import { sequelize } from "../../infrastructure/database/sequelize";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { injectable } from "inversify";

@injectable()
export class GrocerySequelizeRepository implements GroceryRepository {
  public async store(groceryDomain: EntityGrocery): Promise<EntityGrocery> {
    const transaction = await sequelize.transaction(); 
    try {
      const unit = typeof groceryDomain.unit === "string"
        ? Unit[groceryDomain.unit as keyof typeof Unit]
        : groceryDomain.unit;
      const grocery = await Grocery.create(
        {
          name: groceryDomain.name,
          unit,
          price: groceryDomain.price,
        },
        {
          transaction,
        }
      );


      await transaction.commit();

      const entity = EntityGrocery.create({
        name: grocery.name,
        unit: grocery.unit,
        price: grocery.price,
      });

      return entity;
    } catch (e) {
      await transaction.rollback();
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create grocery",
        error: e,
      });
    }
  }

  public async findAll(): Promise<EntityGrocery[]> {
    const groceries = await Grocery.findAll();

    const entityGroceries = groceries.map((grocery) =>
      EntityGrocery.create({
        id: grocery.id,
        name: grocery.name,
        unit: grocery.unit,
        price: grocery.price,
      })
    );

    return entityGroceries;
  }

  async findById(id: string): Promise<EntityGrocery> {
    const grocery = await Grocery.findByPk(id);
    if(!grocery) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Grocery was not found",
      });
    }

    return EntityGrocery.create({
      id: grocery.id,
      name: grocery.name,
      unit: grocery.unit,
      price: grocery.price,
    });
  }

  async update(id: string, groceryDomain: EntityGrocery): Promise<EntityGrocery> {
    const grocery = await Grocery.findByPk(id);

    const unit = typeof groceryDomain.unit === "string"
        ? Unit[groceryDomain.unit as keyof typeof Unit]
        : groceryDomain.unit;
    if(!grocery) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Grocery was not found",
      });
    }
    await grocery.update({
      name: groceryDomain.name,
      unit,
      price: groceryDomain.price,
    });
    await grocery.reload();
    return EntityGrocery.create({
      name: grocery.name,
      unit: grocery.unit,
      price: grocery.price
    })
  }

  async destroy(id: string): Promise<boolean> {
    const grocery = await Grocery.findByPk(id);
    if (!grocery) {
        throw new AppError({
            statusCode: HttpCode.NOT_FOUND,
            description: "Grocery was not found",
        });
    }
    await grocery.destroy();
    return true;
}

}
