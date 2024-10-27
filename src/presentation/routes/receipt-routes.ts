import { container } from "../../container"
import { Router } from "express"
import ReceiptController from "../controllers/receipt-controller";
import asyncWrap from "../../libs/asyncWrapper";
import { injectable } from "inversify";

@injectable()
export class ReceiptRoutes {
  public route = "receipt";
  ReceiptControllerInstance = container.get<ReceiptController>(ReceiptController);

  public setRoutes(router: Router) {
    router.post(
      `/${this.route}`,
      asyncWrap(this.ReceiptControllerInstance.createReceipt.bind(this.ReceiptControllerInstance))
    )

    router.get(
      `/${this.route}`,
      asyncWrap(this.ReceiptControllerInstance.listReceipt.bind(this.ReceiptControllerInstance))
    )

    router.get(
      `/${this.route}/:id`,
      asyncWrap(this.ReceiptControllerInstance.findReceiptById.bind(this.ReceiptControllerInstance))
    )


    router.put(
      `/${this.route}/:id`,
      asyncWrap(this.ReceiptControllerInstance.updateReceipt.bind(this.ReceiptControllerInstance))
    )

    router.delete(
      `/${this.route}/:id`,
      asyncWrap(this.ReceiptControllerInstance.deleteReceipt.bind(this.ReceiptControllerInstance))
    )
  }
}

