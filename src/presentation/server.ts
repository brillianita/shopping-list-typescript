import { container } from "../container";
import { APP_PORT, APP_HOST } from "../libs/utils";
import { Application } from "express";
import { injectable } from "inversify";
import { Routes } from "./routes/routes";
import { Bootstrap } from "./bootstrap";

export interface IServer {
    start(): Application;
}
@injectable()
export class Server implements IServer {
    start(): Application {
        const app = new Bootstrap(container.resolve<Routes>(Routes)).app;
        app.set("port", APP_PORT);
        app.listen(<any>APP_PORT, APP_HOST, () => {
            console.log(`Server started at http://${APP_HOST}:${APP_PORT}`);
        });
        return app;
    }
}
