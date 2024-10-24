import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ISchedule, Schedule } from "../domain/models/schedule";
import { ScheduleRepository } from "../domain/service/schedule-repository";
import { AppError, HttpCode } from "../libs/exceptions/app-error";

@injectable()
export class ScheduleService {
  constructor(
    @inject(TYPES.ScheduleRepository) private _repository: ScheduleRepository
  ) {}

  // Create a new schedule
  public async store(scheduleData: ISchedule): Promise<ISchedule> {
    try {
      const schedule = Schedule.create(scheduleData);
      console.log("Schedule data:", schedule);

      const storedSchedule = await this._repository.store(schedule);
      console.log("Schedule stored:", storedSchedule);

      return storedSchedule.unmarshal();
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: "Failed to store schedule",
        error,
      });
    }
  }}