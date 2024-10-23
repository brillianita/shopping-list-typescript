import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = "local";
export const APP_HOST = process.env.APP_HOST || "localhost";
export const APP_PORT = process.env.APP_PORT || "3000";
export const APP_ENV = process.env.APP_ENV || "local";
export const APP_URL_PREFIX = "/api/"
export const DB_CONFIG = {
  db_name: process.env.DB || "db_local",
  db_user: process.env.USER_DB || "root",
  db_password: process.env.PASSWORD_DB || "root",
  config: {
    host: process.env.HOST_DB || 
    "postgres",
    dialect: process.env.DIALECT_DB || "postgres",
    port: process.env.PORT_DB || "3306"
  }
}
