// Apps Sequelize Model Import
import { Receipt } from "./receipt";
import { Grocery } from "./grocery";
import { ReceiptGroceries } from "./receipt-groceries";
import { Schedule } from "./schedule";
import { ScheduleReceipts } from "./schedule-receipts";

(async () => {

    // Apps Model Synchronisation
    await Receipt.sync({ alter: { drop: false } });
    await Grocery.sync({ alter: { drop: false } });
    await ReceiptGroceries.sync({ alter: { drop: false } });
})();

Receipt.belongsToMany(Grocery, { through: ReceiptGroceries });
Grocery.belongsToMany(Receipt, { through: ReceiptGroceries });

Schedule.belongsToMany(Receipt, { through: ScheduleReceipts });
Receipt.belongsToMany(Schedule, { through: ScheduleReceipts });

// Apps Model Export
export * from "./receipt";
export * from "./grocery";
export * from "./receipt-groceries";
export * from "./schedule";
export * from "./schedule-receipts";