import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ScheduleService } from "../../services/schedule-service";
import { scheduleScheme } from "../validation/schedule-validation";
import { AppError, HttpCode } from "../../libs/exceptions/app-error";
import { TYPES } from "../../types";

@injectable()
export default class ScheduleController {
  constructor(
    @inject(TYPES.ScheduleService) private _scheduleService: ScheduleService
  ) { }

  public async createSchedule(req: Request, res: Response): Promise<Response> {
    const validatedReq = scheduleScheme.safeParse(req.body);

    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const createdSchedule = await this._scheduleService.store(validatedReq.data);

    return res.status(201).json({
      message: "Schedule created successfully",
      data: createdSchedule,
    });
  }

  public async listSchedules(req: Request, res: Response): Promise<Response> {
    const schedules = await this._scheduleService.findAll();
    return res.status(200).json({
      message: "success",
      data: schedules,
    });
  }


  public async getScheduleById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const schedule = await this._scheduleService.findById(id);
    return res.status(200).json({
      message: "success",
      data: schedule,
    });
  }

  public async updateSchedule(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const validatedReq = scheduleScheme.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const updatedSchedule = await this._scheduleService.updateById(id, validatedReq.data);

    return res.status(200).json({
      message: "Schedule updated successfully",
      data: updatedSchedule,
    });
  }

  public async deleteSchedule(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    await this._scheduleService.destroy(id);
    return res.status(200).json({
      message: `Schedule with ID ${id} has been deleted.`,
    });
  }
}
