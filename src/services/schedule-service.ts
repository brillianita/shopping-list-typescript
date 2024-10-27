import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ISchedule, Schedule as EntitySchedule } from "../domain/models/schedule";
import { ScheduleRepository } from "../domain/service/schedule-repository";
import { AppError, HttpCode } from "../libs/exceptions/app-error";
import { IScheduleInput } from "../dto/schedule-dto";

@injectable()
export class ScheduleService {
  constructor(
    @inject(TYPES.ScheduleRepository) private _scheduleRepository: ScheduleRepository
  ) { }

  public async store(scheduleData: IScheduleInput): Promise<ISchedule> {
    try {
      const storedSchedule = await this._scheduleRepository.store(scheduleData);

      return storedSchedule.unmarshal();
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to store schedule",
        error,
      });
    }
  }
  
  public async findAll(): Promise<ISchedule[]> {
    try {
      const schedules = await this._scheduleRepository.findAll();

      return schedules.map(schedule => schedule.unmarshal());
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to fetch schedules",
        error,
      });
    }
  }
}