import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

// Routes
import { Routes } from "./presentation/routes/routes";
import { GroceryRoutes } from "./presentation/routes/grocery-routes";
import { ReceiptRoutes } from "./presentation/routes/receipt-routes";
import { ScheduleRoutes } from "./presentation/routes/schedule-routes";

// Domain Repository
import { GroceryRepository } from "./domain/service/grocery-repository";
import { ReceiptRepository } from "./domain/service/receipt-repository";
import { ScheduleRepository } from "./domain/service/schedule-repository";

// Domain Repository / Infrastructur implementation
import { GrocerySequelizeRepository } from "./persistance/repository/grocery-sequelize-repository";
import { ReceiptSequelizeRepository } from "./persistance/repository/receipt-sequelize-repository";
import { ScheduleSequelizeRepository } from "./persistance/repository/schedule-sequelize-repository";

// Service Implementation
import { GroceryService } from "./services/grocery-service";
import { ReceiptService } from "./services/receipt-service";
import { ScheduleService } from "./services/schedule-service";

// Controller
import GroceryController from "./presentation/controllers/grocery-controller";
import ReceiptController from "./presentation/controllers/receipt-controller";
import ScheduleController from "./presentation/controllers/schedule-controller";


// Bootstrap / kernel
import { IServer, Server } from "./presentation/server";

const container = new Container();

// Kernel Bootstrap
container.bind<IServer>(TYPES.Server).to(Server).inSingletonScope();

// Router
container.bind<Routes>(Routes).toSelf().inSingletonScope();
container.bind<GroceryRoutes>(GroceryRoutes).toSelf().inSingletonScope();
container.bind<ReceiptRoutes>(ReceiptRoutes).toSelf().inSingletonScope();
container.bind<ScheduleRoutes>(ScheduleRoutes).toSelf().inSingletonScope();

container.bind(TYPES.GroceryService).to(GroceryService);
container.bind(TYPES.ReceiptService).to(ReceiptService);
container.bind(TYPES.ScheduleService).to(ScheduleService);


// Controller
container.bind(GroceryController).toSelf();
container.bind(ReceiptController).toSelf();
container.bind(ScheduleController).toSelf();


// implement infrastructur
container.bind<GroceryRepository>(TYPES.GroceryRepository).to(GrocerySequelizeRepository);
container.bind<ReceiptRepository>(TYPES.ReceiptRepository).to(ReceiptSequelizeRepository);
container.bind<ScheduleRepository>(TYPES.ScheduleRepository).to(ScheduleSequelizeRepository);

export { container };
