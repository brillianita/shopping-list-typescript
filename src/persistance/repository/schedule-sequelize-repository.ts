import { ScheduleRepository } from "../../domain/service/schedule-repository";
import { Schedule as EntitySchedule, ISchedule } from "../../domain/models/schedule";
import { Schedule } from "../../infrastructure/database/models/schedule";
import { Receipt } from "../../infrastructure/database/models/receipt";
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
}
