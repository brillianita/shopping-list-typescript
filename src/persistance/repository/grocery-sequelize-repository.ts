import { GroceryRepository } from "../../domain/service/grocery-repository";
import { Grocery } from "../../infrastructure/database/models/grocery";
import { Grocery as EntityGrocery, IGrocery, Unit } from "../../domain/models/grocery";
import { sequelize } from "../../infrastructure/database/sequelize";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { injectable } from "inversify";

@injectable()
export class GrocerySequelizeRepository implements GroceryRepository {
  public async store(groceryDomain: EntityGrocery): Promise<EntityGrocery> {
    const transaction = await sequelize.transaction(); // Membuka transaksi
    try {
      // Mengonversi unit dari string ke enum jika diperlukan
      const unit = typeof groceryDomain.unit === "string"
        ? Unit[groceryDomain.unit as keyof typeof Unit]
        : groceryDomain.unit;

      // Membuat entitas Grocery menggunakan Sequelize
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

    // Konversi hasil dari Sequelize ke entity domain
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
  
}
