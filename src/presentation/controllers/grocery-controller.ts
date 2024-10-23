import type { Request, Response } from "express";
import { GrocerySequelizeRepository } from "../../persistance/repository/grocery-sequelize-repository";
import { GroceryService } from "../../services/grocery-service";
import { groceryScheme } from "../validation/grocery-validation";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";


@injectable()
export default class GroceryController {
  constructor(@inject(TYPES.GroceryService) private _groceryService: GroceryService) { }
  public async createGrocery(req: Request, res: Response): Promise<Response> {
    const validatedReq = groceryScheme.safeParse(req.body);
    console.log('reqbody', req.body)
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const created = await this._groceryService.store(validatedReq.data);
    return res.json({
      message: "success",
      data: created,
    });
  }

  public async listGroceries(req: Request, res: Response): Promise<Response> {
    const groceries = await this._groceryService.findAll();
    return res.status(200).send({ message: "success", data: groceries.map((val) => val) });
  }

  public async findGroceryById(req: Request, res: Response): Promise<Response> {
    const grocery = await this._groceryService.findById(req.params.id);
    return res.json({
      message: "success",
      data: grocery,
    });
  }

  public async updateGrocery(req: Request, res: Response): Promise<Response> {
    const validatedReq = groceryScheme.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const created = await this._groceryService.update(req.params.id, validatedReq.data);
    return res.json({
      message: "success",
      data: created,
    });
  }


  public async deleteGrocery(req: Request, res: Response): Promise<Response> {
    await this._groceryService.destroy(req.params.id);
    return res.json({
        message: "Grocery has been deleted",
    });
}
}
