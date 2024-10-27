import { IScheduleInput } from "../../dto/schedule-dto";
import { ISchedule, Schedule } from "../models/schedule";

export interface ScheduleRepository {
    findAll(): Promise<Schedule[]>;
    findById(id: string): Promise<Schedule>;
    store(schedule: IScheduleInput): Promise<Schedule>;
    // update(id: string, user: ISchedule): Promise<Schedule>;
    // destroy(id: string): Promise<boolean>;
}
