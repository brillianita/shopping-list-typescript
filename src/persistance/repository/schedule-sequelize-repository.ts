import { ScheduleRepository } from "../../domain/service/schedule-repository";
import { Schedule as EntitySchedule, ISchedule } from "../../domain/models/schedule";
import { Schedule, Receipt, Grocery } from "../../infrastructure/database/models";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { sequelize } from "../../infrastructure/database/sequelize";
import { injectable } from "inversify";
import { IScheduleInput } from "../../dto/schedule-dto";

@injectable()
export class ScheduleSequelizeRepository implements ScheduleRepository {
  public async store(scheduleDomain: IScheduleInput): Promise<EntitySchedule> {
    const transaction = await sequelize.transaction();
    try {
      const schedule = await Schedule.create(
        { name: scheduleDomain.name },
        { transaction }
      );

      const receipts = await Receipt.findAll({
        where: { id: scheduleDomain.receipts },
        include: [
          {
            model: Grocery,
            through: { attributes: ['quantity'] },
          },
        ],
        transaction,
      });

    
      await schedule.addReceipts(receipts, { transaction });
      await transaction.commit();

      const scheduleEntity = EntitySchedule.create({
        id: schedule.id,
        name: schedule.name,
        receipts: receipts.map(receipt => ({
          id: receipt.id,
          name: receipt.name,
          groceries: receipt.Groceries?.map(grocery => ({
            id: grocery.id,
            name: grocery.name,
            unit: grocery.unit,
            price: grocery.price,
            quantity: (grocery as any).ReceiptGroceries?.quantity || 0,
          })) || [],
        })),
      });

      return scheduleEntity;

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
            model: Grocery,
            through: { attributes: ["quantity"] },
          }],
        }],
      });

      return schedules.map((schedule) => {
        const scheduleEntity = EntitySchedule.create({
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
              quantity: (grocery as any).ReceiptGroceries?.quantity || 0,
            })) || [],
          })) || [],
        });

        
        return scheduleEntity;
      });

    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to fetch schedules",
        error,
      });
    }
  }

  public async findById(id: string): Promise<EntitySchedule> {
    try {
      const schedule = await Schedule.findByPk(id, {
        include: [{
          model: Receipt,
          include: [{
            model: Grocery,
            through: { attributes: ["quantity"] },
          }],
        }],
      });

      // Check if the schedule exists
      if (!schedule) {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: `Schedule with ID ${id} not found.`,
        });
      }

      // Map the database schedule to the domain model
      const scheduleEntity = EntitySchedule.create({
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
            quantity: (grocery as any).ReceiptGroceries?.quantity || 0,
          })) || [],
        })) || [],
      });

      return scheduleEntity;

    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to fetch schedule",
        error,
      });
    }
  }
}
