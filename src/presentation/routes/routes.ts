import { Router } from "express";
import { GroceryController } from "../controllers/grocery-controller";
import { ReceiptController } from "../controllers/receipt-controller";
import { ScheduleController } from "../controllers/schedule-controller";

const router = Router();
const controller = new GroceryController();
const receiptController = new ReceiptController();
const scheduleController = new ScheduleController();

router.post("/grocery", controller.createGrocery.bind(controller));
router.get("/groceries", controller.getGroceries.bind(controller));
router.get("/grocery/:id", controller.getGroceryById.bind(controller));
router.put("/grocery/:id", controller.updateGrocery.bind(controller));
router.delete("/grocery/:id", controller.deleteGrocery.bind(controller));

router.post("/receipt", receiptController.createReceipt.bind(receiptController));
router.get("/receipts", receiptController.getReceipts.bind(receiptController));
router.get("/receipt/:id", receiptController.getReceiptById.bind(receiptController));
router.put("/receipt/:id", receiptController.updateReceipt.bind(receiptController));
router.delete("/receipt/:id", receiptController.deleteReceipt.bind(receiptController));

router.post("/schedule", scheduleController.createSchedule.bind(scheduleController));
router.get("/schedules", scheduleController.getSchedules.bind(scheduleController));
router.get("/schedule/:id", scheduleController.getScheduleById.bind(scheduleController));
router.put("/schedule/:id", scheduleController.updateSchedule.bind(scheduleController));
router.delete("/schedule/:id", scheduleController.deleteSchedule.bind(scheduleController));

router.get("/schedule/:id/total-spending", scheduleController.getTotalSpending.bind(scheduleController));

export default router;
