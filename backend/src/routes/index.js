import express from 'express';
import authRoutes from './auth.js';
import medicineRoutes from './medicines.js';
import batchRoutes from './batches.js';
import stockRoutes from './stocks.js';
import transactionRoutes from './transactions.js';
import healthCenterRoutes from './healthCenters.js';
import iotRoutes from './iot.js';
/*import aiRoutes from './ai.js';*/
import reportRoutes from './reports.js';
import alertRoutes from './alerts.js';
/*import blockchainRoutes from './blockchain.js';*/

export function setupRoutes(app) {
  const apiVersion = process.env.API_VERSION || 'v1';
  const baseRoute = `/api/${apiVersion}`;

  // Routes d'authentification
  app.use(`${baseRoute}/auth`, authRoutes);
  
  // Routes des ressources
  app.use(`${baseRoute}/medicines`, medicineRoutes);
  app.use(`${baseRoute}/batches`, batchRoutes);
  app.use(`${baseRoute}/stocks`, stockRoutes);
  app.use(`${baseRoute}/transactions`, transactionRoutes);
  app.use(`${baseRoute}/health-centers`, healthCenterRoutes);
  app.use(`${baseRoute}/iot`, iotRoutes);
  /*app.use(`${baseRoute}/ai`, aiRoutes);*/
  app.use(`${baseRoute}/reports`, reportRoutes);
  app.use(`${baseRoute}/alerts`, alertRoutes);
 /* app.use(`${baseRoute}/blockchain`, blockchainRoutes);*/

  // Route de test
  app.get(`${baseRoute}/test`, (req, res) => {
    res.json({
      success: true,
      message: 'API MedTrack Africa opérationnelle',
      version: apiVersion,
      timestamp: new Date().toISOString()
    });
  });
}