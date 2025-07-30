import { Sequelize } from 'sequelize';
import config from './config';

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect as 'mysql',
    logging: false, // Set to console.log if you want query logs
    dialectOptions: {
      connectTimeout: 20000, // Prevent ETIMEDOUT errors (20 seconds)
    },
  }
);

export default sequelize;
