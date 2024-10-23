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
      // First, delete all existing receipts for this schedule
      await ScheduleReceipts.destroy({ where: { ScheduleId: id } });

      // Then, add the new receipts
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
    // Delete the schedule and its associated receipts from the pivot table
    await ScheduleReceipts.destroy({ where: { ScheduleId: id } });
    return await Schedule.destroy({ where: { id } });
  }

  // Function to calculate total spending for a given schedule
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

          // Push grocery details into array
          groceriesDetails.push({
            id: grocery.id,
            name: grocery.name,
            price: grocery.price,
            quantity: quantity  
          });
        }
      }

      // Push receipt details into array
      receiptDetails.push({
        name: receipt.name,
        groceries: groceriesDetails
      });
    }

    // Format the final output
    return {
      id: schedule.id,
      totalSpending: totalSpending,
      receipts: receiptDetails
    };
  }

}
