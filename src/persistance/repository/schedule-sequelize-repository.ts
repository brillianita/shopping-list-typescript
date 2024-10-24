import { Schedule } from "../../infrastructure/database/models/schedule";
import { ScheduleReceipts } from "../../infrastructure/database/models/schedule-receipts";
import { Receipt } from "../../infrastructure/database/models/receipt";
import { Grocery } from "../../infrastructure/database/models/grocery";

interface ISchedule {
  id?: string;
  name: string;
  receipts: string[];
}

export class ScheduleSequelizeRepository {
  public async create(props: ISchedule): Promise<Schedule> {
    const { receipts, ...scheduleProps } = props;

    const schedule = await Schedule.create(scheduleProps);

    if (receipts && receipts.length) {
      for (const receiptId of receipts) {
        await ScheduleReceipts.create({
          ScheduleId: schedule.id,
          ReceiptId: receiptId,
        });
      }
    }

    return schedule;
  }

  public async getAll(): Promise<Schedule[]> {
    return await Schedule.findAll({
      include: Receipt,
    });
  }

  public async getById(id: string): Promise<Schedule | null> {
    return await Schedule.findByPk(id, {
      include: Receipt,
    });
  }

  public async update(id: string, props: Partial<ISchedule>): Promise<[number, Schedule[]]> {
    const { receipts, ...scheduleProps } = props;

    const updatedSchedule = await Schedule.update(scheduleProps, {
      where: { id },
      returning: true
    });

    if (receipts && receipts.length) {
      await ScheduleReceipts.destroy({ where: { ScheduleId: id } });

      for (const receiptId of receipts) {
        await ScheduleReceipts.create({
          ScheduleId: id,
          ReceiptId: receiptId,
        });
      }
    }

    return updatedSchedule;
  }

  public async delete(id: string): Promise<number> {
    await ScheduleReceipts.destroy({ where: { ScheduleId: id } });
    return await Schedule.destroy({ where: { id } });
  }

  public async calculateTotalSpending(id: string): Promise<any | null> {
    const schedule = await Schedule.findByPk(id, {
      include: [
        {
          model: Receipt,
          include: [
            {
              model: Grocery,
              through: { attributes: ['quantity'] }
            }
          ]
        }
      ]
    });

    if (!schedule || !schedule.Receipts) {
      return null;
    }

    let totalSpending = 0;
    const receiptDetails = [];

    for (const receipt of schedule.Receipts) {
      const groceriesDetails = [];

      if (receipt.Groceries) {
        for (const grocery of receipt.Groceries) {
          const quantity = (grocery as any).ReceiptGroceries.quantity;
          totalSpending += grocery.price * quantity;

          groceriesDetails.push({
            id: grocery.id,
            name: grocery.name,
            price: grocery.price,
            quantity: quantity
          });
        }
      }

      receiptDetails.push({
        name: receipt.name,
        groceries: groceriesDetails
      });
    }


    return {
      id: schedule.id,
      totalSpending: totalSpending,
      receipts: receiptDetails
    };
  }

}
