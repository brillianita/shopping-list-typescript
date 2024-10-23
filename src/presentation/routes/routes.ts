import { Router } from "express";
import { injectable } from "inversify";
import { GroceryRoutes } from "./grocery-routes";

@injectable()
export class Routes {
  constructor(
    private groceryRoutes: GroceryRoutes,
  ) { }

  public setRoutes(router: Router): void {
    this.groceryRoutes.setRoutes(router);
  }
}
