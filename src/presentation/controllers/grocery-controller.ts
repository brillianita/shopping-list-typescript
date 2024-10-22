import type { Request, Response } from "express";
import { GrocerySequelizeRepository } from "../../persistance/repository/grocery-sequelize-repository";
import { unit } from "../../infrastructure/database/models/grocery";

export class GroceryController {
  private persistance: GrocerySequelizeRepository | null = null;
  
  constructor() {
    this.persistance = new GrocerySequelizeRepository();
  }

  public async createGrocery(req: Request, res: Response): Promise<void> {
    try {
      const { name, unit, price } = req.body;
      const result = await this.persistance?.create({ name, unit, price });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to create grocery item" });
    }
  }

  public async getGroceries(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.persistance?.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch groceries" });
    }
  }

  public async getGroceryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.persistance?.getById(id);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: "Grocery item not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grocery item" });
    }
  }

  public async updateGrocery(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, unit, price } = req.body;
      const result = await this.persistance?.update(id, { name, unit, price });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to update grocery item" });
    }
  }

  public async deleteGrocery(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.persistance?.delete(id);
      if (result) {
        res.status(200).json({ message: "Grocery item deleted successfully" });
      } else {
        res.status(404).json({ error: "Grocery item not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete grocery item" });
    }
  }
}
