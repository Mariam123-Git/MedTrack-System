import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { connectDatabase } from './database/connection.js';
import { setupRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { initializeHedera } from './services/hedera.js';
import { initializeMQTT } from './services/mqtt.js';
import { initializeAI } from './services/ai.js';
import { setupSocketIO } from './services/socket.js';

dotenv.config();
console.log('DB_PASSWORD:', process.env.DB_PASSWORD, typeof process.env.DB_PASSWORD);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin:  "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});

// Middlewares de sécurité
app.use(helmet());
app.use(compression());
app.use(limiter);

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Routes de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Configuration des routes
setupRoutes(app);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Initialisation des services
async function initializeServices() {
  try {
    // Connexion à la base de données
    await connectDatabase();
    logger.info('✅ Base de données connectée');
/*
    // Initialisation Hedera
    await initializeHedera();
    logger.info('✅ Hedera Hashgraph initialisé');

    // Initialisation MQTT pour IoT
    await initializeMQTT();
    logger.info('✅ MQTT initialisé');

    // Initialisation IA
    await initializeAI();
    logger.info('✅ Services IA initialisés');

    // Configuration Socket.IO
    setupSocketIO(io);
    logger.info('✅ Socket.IO configuré');*/

  } catch (error) {
    logger.error('❌ Erreur lors de l\'initialisation des services:', error);
    process.exit(1);
  }
}

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  logger.info(`🚀 Serveur MedTrack Africa démarré sur le port ${PORT}`);
  logger.info(`🌍 Environnement: ${process.env.NODE_ENV}`);
  
  await initializeServices();
  
  logger.info('🎉 Tous les services sont opérationnels');
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export { app, io };