import { ScheduleRepository } from "../../domain/service/schedule-repository";
import { Schedule as EntitySchedule, ISchedule } from "../../domain/models/schedule";
import { Schedule } from "../../infrastructure/database/models/schedule";
import { Receipt } from "../../infrastructure/database/models/receipt";
import { Grocery } from "../../infrastructure/database/models/grocery";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { sequelize } from "../../infrastructure/database/sequelize";
import { injectable } from "inversify";

@injectable()
export class ScheduleSequelizeRepository implements ScheduleRepository {

  public async store(scheduleDomain: EntitySchedule): Promise<EntitySchedule> {
    const transaction = await sequelize.transaction();
    try {
      const schedule = await Schedule.create(
        {
          name: scheduleDomain.name,
        },
        { transaction }
      );

      const receipts = await Receipt.findAll({
        where: {
          id: scheduleDomain.receipts,
        },
        transaction,
      });

      if (!schedule.id) {
        throw new Error("Failed to generate Schedule ID");
      }

      await Promise.all(
        receipts.map(async (receipt) => {
          await schedule.addReceipt(receipt, { transaction });
        })
      );

      await transaction.commit();

      const entity = EntitySchedule.create({
        id: schedule.id,
        name: schedule.name,
        receipts: receipts.map(receipt => receipt.id), 
      });

      return entity;
    } catch (error) {
      await transaction.rollback();
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create schedule",
        error,
      });
    }
  }

  public async findAll(): Promise<EntitySchedule[]> {
    try {
      const schedules = await Schedule.findAll({
        include: [{
          model: Receipt,
          include: [{
            model: Grocery
          }],
        }],
      });
      console.log("schedules", schedules)
      return schedules.map((schedule) => {
        return EntitySchedule.create({
          id: schedule.id,
          name: schedule.name,
          receipts: schedule.Receipts?.map(receipt => ({
            id: receipt.id,
            name: receipt.name,
            groceries: receipt.Groceries?.map(grocery => ({
              id: grocery.id,
              name: grocery.name,
              unit: grocery.unit,
              price: grocery.price,
              quantity: (grocery as any).ReceiptGroceries.quantity
            })) || [],
          })) || [],
        });
      });
    } catch (e) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to fetch receipts",
        error: e,
      });
    }
  }
}
