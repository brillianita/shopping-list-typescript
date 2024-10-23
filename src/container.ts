import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

// Routes
import { Routes } from "./presentation/routes/routes";
import { GroceryRoutes } from "./presentation/routes/grocery-routes";

// Domain Repository
import { GroceryRepository } from "./domain/service/grocery-repository";

// Domain Repository / Infrastructur implementation
import { GrocerySequelizeRepository } from "./persistance/repository/grocery-sequelize-repository";

// Service Implementation
import { GroceryService } from "./services/grocery-service";

// Controller
import GroceryController from "./presentation/controllers/grocery-controller";


// Bootstrap / kernel
import { IServer, Server } from "./presentation/server";

const container = new Container();

// Kernel Bootstrap
container.bind<IServer>(TYPES.Server).to(Server).inSingletonScope();

// Router
container.bind<Routes>(Routes).toSelf().inSingletonScope();
container.bind<GroceryRoutes>(GroceryRoutes).toSelf().inSingletonScope();

// Service Layer
// Mobile Service
container.bind(TYPES.GroceryService).to(GroceryService);


// Controller
// container.bind(GroceryController).toSelf();

// Binding untuk Controller
container.bind<GroceryController>(GroceryController).toSelf();

// implement infrastructur
container.bind<GroceryRepository>(TYPES.GroceryRepository).to(GrocerySequelizeRepository);

export { container };
