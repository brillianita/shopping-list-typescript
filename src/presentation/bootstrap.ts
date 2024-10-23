import express, { Request, Response, NextFunction } from "express";
import { APP_URL_PREFIX } from "../libs/utils";
import { Routes } from "./routes/routes";

export class Bootstrap {
    public app = express();

    constructor(private appRoutes: Routes) {
        this.app = express();
        this.setRoutes();
    }

    private setRoutes(): void {
        const router = express.Router();
        this.app.use(express.json())
        this.app.use(APP_URL_PREFIX, router);
        router.get("/health-check", (req, res, next) => {
            res.json({
                message: "server is up boys",
            });
        });
        this.appRoutes.setRoutes(router);
    }
}
