import type { Request, Response } from "express";
import { ReceiptSequelizeRepository } from "../../persistance/repository/receipt-sequelize-repository";
import { ReceiptService } from "../../services/receipt-service";
import { receiptScheme } from "../validation/receipt-validation";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";


@injectable()
export default class ReceiptController {
  constructor(@inject(TYPES.ReceiptService) private _receiptService: ReceiptService) { }
  public async createReceipt(req: Request, res: Response): Promise<Response> {
    const validatedReq = receiptScheme.safeParse(req.body);
    console.log('reqbody', req.body)
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const created = await this._receiptService.store(validatedReq.data);
    return res.json({
      message: "success",
      data: created,
    });
  }

  public async listReceipt(req: Request, res: Response): Promise<Response> {
    const receipts = await this._receiptService.findAll();
    return res.status(200).send({ message: "success", data: receipts });
  }

  public async findReceiptById(req: Request, res: Response): Promise<Response> {
      const receiptId = req.params.id;
      const receipt = await this._receiptService.findById(receiptId); 

      return res.json({
        message: "success",
        data: receipt,
      });
  }

  // public async findReceiptById(req: Request, res: Response): Promise<Response> {
  //   const receipt = await this._receiptService.findById(req.params.id);
  //   return res.json({
  //     message: "success",
  //     data: receipt,
  //   });
  // }

  // public async updateReceipt(req: Request, res: Response): Promise<Response> {
  //   const validatedReq = receiptScheme.safeParse(req.body);
  //   if (!validatedReq.success) {
  //     throw new AppError({
  //       statusCode: HttpCode.VALIDATION_ERROR,
  //       description: "Request validation error",
  //       data: validatedReq.error.flatten().fieldErrors,
  //     });
  //   }
  //   const created = await this._receiptService.update(req.params.id, validatedReq.data);
  //   return res.json({
  //     message: "success",
  //     data: created,
  //   });
  // }


  // public async deleteReceipt(req: Request, res: Response): Promise<Response> {
  //   await this._receiptService.destroy(req.params.id);
  //   return res.json({
  //     message: "Receipt has been deleted",
  //   });
  // }
}
