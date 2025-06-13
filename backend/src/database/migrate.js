import { sequelize } from './connection.js';
import { logger } from '../utils/logger.js';

async function runMigrations() {
  try {
    logger.info('Début des migrations de base de données...');
    
    // Synchronisation des modèles avec la base de données
    await sequelize.sync({ force: false, alter: true });
    
    logger.info('✅ Migrations terminées avec succès');
    process.exit(0);
    
  } catch (error) {
    logger.error('❌ Erreur lors des migrations:', error);
    process.exit(1);
  }
}

runMigrations();