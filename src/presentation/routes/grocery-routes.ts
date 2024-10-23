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
  }
}

