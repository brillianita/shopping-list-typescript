import type { Request, Response } from "express";
import { ReceiptSequelizeRepository } from "../../persistance/repository/receipt-sequelize-repository";

export class ReceiptController {
  private persistance: ReceiptSequelizeRepository | null = null;

  constructor() {
    this.persistance = new ReceiptSequelizeRepository();
  }

  public async createReceipt(req: Request, res: Response): Promise<void> {
    try {
      const { name, groceries } = req.body;
      const result = await this.persistance?.create({ name, groceries });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to create receipt" });
    }
  }

  public async getReceipts(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.persistance?.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async getReceiptById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.persistance?.getById(id);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: "Receipt not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch receipt" });
    }
  }

  public async updateReceipt(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, groceries } = req.body;
      const result = await this.persistance?.update(id, { name, groceries });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to update receipt" });
    }
  }

  public async deleteReceipt(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.persistance?.delete(id);
      if (result) {
        res.status(200).json({ message: "Receipt deleted successfully" });
      } else {
        res.status(404).json({ error: "Receipt not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete receipt" });
    }
  }
}
