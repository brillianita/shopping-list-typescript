import { DB_CONFIG } from '../../libs/utils';
import { Dialect, Sequelize } from 'sequelize';
const { db_name, db_user, db_password } = DB_CONFIG;

const sequelize = new Sequelize(db_name, db_user, db_password, {
  host: DB_CONFIG.config.host,
  dialect: <Dialect> DB_CONFIG.config.dialect,
  port: parseInt(DB_CONFIG.config.port),
  logging: false,
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database schema updated!');
  })
  .catch((error) => {
    console.error('Failed to update schema:', error);
  });


export {Sequelize, sequelize };