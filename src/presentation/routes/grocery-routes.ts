import { container } from "../../container"
import { Router } from "express"
import GroceryController from "../controllers/grocery-controller";
import asyncWrap from "../../libs/asyncWrapper";
import { injectable } from "inversify";

@injectable()
export class GroceryRoutes {
  public route = "grocery";
  GroceryControllerInstance = container.get<GroceryController>(GroceryController);

  public setRoutes(router: Router) {
    router.post(
      `/${this.route}`,
      asyncWrap(this.GroceryControllerInstance.createGrocery.bind(this.GroceryControllerInstance))
    )

    router.get(
      `/${this.route}`,
      asyncWrap(this.GroceryControllerInstance.listGroceries.bind(this.GroceryControllerInstance))
    )

    router.get(
      `/${this.route}/:id`,
      asyncWrap(this.GroceryControllerInstance.findGroceryById.bind(this.GroceryControllerInstance))
    )

    router.put(
      `/${this.route}/:id`,
      asyncWrap(this.GroceryControllerInstance.updateGrocery.bind(this.GroceryControllerInstance))
    )

    router.delete(
      `/${this.route}/:id`,
      asyncWrap(this.GroceryControllerInstance.deleteGrocery.bind(this.GroceryControllerInstance))
    )
  }
}

