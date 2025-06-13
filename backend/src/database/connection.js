import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger.js';

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? 
    (msg) => logger.debug(msg) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Connexion à PostgreSQL établie avec succès');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Modèles synchronisés avec la base de données');
    }
    
    return sequelize;
  } catch (error) {
    logger.error('Impossible de se connecter à la base de données:', error);
    throw error;
  }
}

export { sequelize };