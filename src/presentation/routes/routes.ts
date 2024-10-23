import { Router } from "express";
import { injectable } from "inversify";
import { GroceryRoutes } from "./grocery-routes";
import { ReceiptRoutes } from "./receipt-routes";

@injectable()
export class Routes {
  constructor(
    private groceryRoutes: GroceryRoutes,
    private receiptRoutes: ReceiptRoutes,
  ) { }

  public setRoutes(router: Router): void {
    this.groceryRoutes.setRoutes(router);
    this.receiptRoutes.setRoutes(router);
  }
}
