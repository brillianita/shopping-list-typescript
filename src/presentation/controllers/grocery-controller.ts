import type { Request, Response } from "express";
import { GrocerySequelizeRepository } from "../../persistance/repository/grocery-sequelize-repository";
import { GroceryService } from "../../services/grocery-service";
import { groceryCreateScheme } from "../validation/grocery-validation";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";


@injectable()
export default class GroceryController {
  constructor(@inject(TYPES.GroceryService) private _groceryService: GroceryService) { }
  public async createGrocery(req: Request, res: Response): Promise<Response> {
    const validatedReq = groceryCreateScheme.safeParse(req.body);
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
    return res.status(200).send({message: "success", data: groceries.map((val) => val)});
  }
}
