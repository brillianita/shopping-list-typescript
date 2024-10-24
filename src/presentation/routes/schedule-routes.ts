import { container } from "../../container"
import { Router } from "express"
import ScheduleController from "../controllers/schedule-controller";
import asyncWrap from "../../libs/asyncWrapper";
import { injectable } from "inversify";

@injectable()
export class ScheduleRoutes {
  public route = "schedule";
  ScheduleControllerInstance = container.get<ScheduleController>(ScheduleController);

  public setRoutes(router: Router) {
    router.post(
      `/${this.route}`,
      asyncWrap(this.ScheduleControllerInstance.createSchedule.bind(this.ScheduleControllerInstance))
    )

    router.get(
      `/${this.route}`,
      asyncWrap(this.ScheduleControllerInstance.listSchedules.bind(this.ScheduleControllerInstance))
    )
  }

  //   router.get(
  //     `/${this.route}/:id`,
  //     asyncWrap(this.ScheduleControllerInstance.findScheduleById.bind(this.ScheduleControllerInstance))
  //   )


  //   router.put(
  //     `/${this.route}/:id`,
  //     asyncWrap(this.ScheduleControllerInstance.updateSchedule.bind(this.ScheduleControllerInstance))
  //   )

  //   router.delete(
  //     `/${this.route}/:id`,
  //     asyncWrap(this.ScheduleControllerInstance.deleteSchedule.bind(this.ScheduleControllerInstance))
  //   )
  // }
}

