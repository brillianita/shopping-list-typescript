import type { Request, Response } from "express";
import { ScheduleSequelizeRepository } from "../persistance/schedule-sequelize-repository";

export class ScheduleController {
  private persistance: ScheduleSequelizeRepository | null = null;

  constructor() {
    this.persistance = new ScheduleSequelizeRepository();
  }

  public async createSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { name, receipts } = req.body;
      const result = await this.persistance?.create({ name, receipts });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to create schedule" });
    }
  }

  public async getSchedules(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.persistance?.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  }

  public async getScheduleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.persistance?.getById(id);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: "Schedule not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedule" });
    }
  }

  public async updateSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, receipts } = req.body;
      const result = await this.persistance?.update(id, { name, receipts });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to update schedule" });
    }
  }

  public async deleteSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.persistance?.delete(id);
      if (result) {
        res.status(200).json({ message: "Schedule deleted successfully" });
      } else {
        res.status(404).json({ error: "Schedule not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete schedule" });
    }
  }

  public async getTotalSpending(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const totalSpendingDetails = await this.persistance?.calculateTotalSpending(id);
      if (totalSpendingDetails) {
        res.status(200).json(totalSpendingDetails);
      } else {
        res.status(404).json({ error: "Schedule not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate total spending" });
    }
  }
  
}
