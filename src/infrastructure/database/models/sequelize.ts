import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB as string,
  process.env.USER_DB as string,
  process.env.PASSWORD_DB as string,
  {
    host: process.env.HOST_DB,
    dialect: 'postgres',
    logging: false,
  }
);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database schema updated!');
  })
  .catch((error) => {
    console.error('Failed to update schema:', error);
  });

export { sequelize };