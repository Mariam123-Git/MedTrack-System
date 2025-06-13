import * as tf from '@tensorflow/tfjs'
import { logger } from '../utils/logger.js';
import { Stock, Medicine, HealthCenter, Transaction } from '../models/index.js';
import { Op } from 'sequelize';

let stockPredictionModel;
let demandForecastModel;

export async function initializeAI() {
  try {
    // Chargement ou création des modèles IA
    await loadOrCreateStockPredictionModel();
    await loadOrCreateDemandForecastModel();
    
    logger.info('Services IA initialisés avec succès');
  } catch (error) {
    logger.error('Erreur lors de l\'initialisation de l\'IA:', error);
    throw error;
  }
}

async function loadOrCreateStockPredictionModel() {
  try {
    // Tentative de chargement du modèle existant
    stockPredictionModel = await tf.loadLayersModel(`file://${process.env.AI_MODEL_PATH}`);
    logger.info('Modèle de prédiction des stocks chargé');
  } catch (error) {
    // Création d'un nouveau modèle si le chargement échoue
    logger.info('Création d\'un nouveau modèle de prédiction des stocks');
    stockPredictionModel = createStockPredictionModel();
  }
}

async function loadOrCreateDemandForecastModel() {
  try {
    demandForecastModel = await tf.loadLayersModel(`file://./models/demand_forecast_model.json`);
    logger.info('Modèle de prévision de la demande chargé');
  } catch (error) {
    logger.info('Création d\'un nouveau modèle de prévision de la demande');
    demandForecastModel = createDemandForecastModel();
  }
}

function createStockPredictionModel() {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: 32, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: 16, activation: 'relu' }),
      tf.layers.dense({ units: 1, activation: 'linear' })
    ]
  });

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['mae']
  });

  return model;
}

function createDemandForecastModel() {
  const model = tf.sequential({
    layers: [
      tf.layers.lstm({ inputShape: [30, 5], units: 50, returnSequences: true }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.lstm({ units: 50, returnSequences: false }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: 25, activation: 'relu' }),
      tf.layers.dense({ units: 1, activation: 'linear' })
    ]
  });

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['mae']
  });

  return model;
}

export async function predictStockNeeds(healthCenterId, medicineId, days = 30) {
  try {
    // Récupération des données historiques
    const historicalData = await getHistoricalStockData(healthCenterId, medicineId, 90);
    
    if (historicalData.length < 10) {
      throw new Error('Données insuffisantes pour la prédiction');
    }

    // Préparation des features
    const features = prepareStockFeatures(historicalData);
    const inputTensor = tf.tensor2d([features]);

    // Prédiction
    const prediction = stockPredictionModel.predict(inputTensor);
    const predictedStock = await prediction.data();

    inputTensor.dispose();
    prediction.dispose();

    return {
      predictedStock: Math.round(predictedStock[0]),
      confidence: calculatePredictionConfidence(historicalData),
      recommendedAction: getStockRecommendation(predictedStock[0], historicalData),
      predictionDate: new Date(),
      forecastDays: days
    };

  } catch (error) {
    logger.error('Erreur lors de la prédiction des stocks:', error);
    throw error;
  }
}

export async function forecastDemand(medicineId, region, days = 30) {
  try {
    // Récupération des données de demande historique
    const demandData = await getHistoricalDemandData(medicineId, region, 180);
    
    if (demandData.length < 30) {
      throw new Error('Données insuffisantes pour la prévision de demande');
    }

    // Préparation des séquences temporelles
    const sequences = prepareDemandSequences(demandData);
    const inputTensor = tf.tensor3d([sequences]);

    // Prévision
    const forecast = demandForecastModel.predict(inputTensor);
    const forecastedDemand = await forecast.data();

    inputTensor.dispose();
    forecast.dispose();

    return {
      forecastedDemand: Math.round(forecastedDemand[0]),
      trend: calculateDemandTrend(demandData),
      seasonality: detectSeasonality(demandData),
      confidence: calculateForecastConfidence(demandData),
      forecastDate: new Date(),
      forecastDays: days
    };

  } catch (error) {
    logger.error('Erreur lors de la prévision de demande:', error);
    throw error;
  }
}

export async function optimizeStockDistribution(region) {
  try {
    // Récupération des centres de santé et stocks actuels
    const healthCenters = await HealthCenter.findAll({
      where: { region, is_active: true },
      include: [{
        model: Stock,
        include: [Medicine]
      }]
    });

    const optimizationResults = [];

    for (const center of healthCenters) {
      for (const stock of center.Stocks) {
        // Prédiction des besoins pour chaque médicament
        const prediction = await predictStockNeeds(center.id, stock.medicine_id);
        
        // Calcul des recommandations de redistribution
        const recommendation = calculateRedistributionRecommendation(
          stock, prediction, healthCenters
        );

        if (recommendation.action !== 'maintain') {
          optimizationResults.push({
            healthCenter: center.name,
            medicine: stock.Medicine.name,
            currentStock: stock.quantity,
            predictedNeed: prediction.predictedStock,
            recommendation
          });
        }
      }
    }

    return optimizationResults;

  } catch (error) {
    logger.error('Erreur lors de l\'optimisation de distribution:', error);
    throw error;
  }
}

export async function detectAnomalies(healthCenterId) {
  try {
    // Récupération des données récentes
    const recentTransactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { from_center_id: healthCenterId },
          { to_center_id: healthCenterId }
        ],
        created_at: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 derniers jours
        }
      },
      include: [Medicine]
    });

    const anomalies = [];

    // Détection d'anomalies dans les patterns de consommation
    const consumptionPatterns = analyzeConsumptionPatterns(recentTransactions);
    
    for (const pattern of consumptionPatterns) {
      if (pattern.isAnomalous) {
        anomalies.push({
          type: 'consumption_anomaly',
          medicine: pattern.medicine,
          description: pattern.description,
          severity: pattern.severity,
          detectedAt: new Date()
        });
      }
    }

    return anomalies;

  } catch (error) {
    logger.error('Erreur lors de la détection d\'anomalies:', error);
    throw error;
  }
}

// Fonctions utilitaires
async function getHistoricalStockData(healthCenterId, medicineId, days) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return await Stock.findAll({
    where: {
      health_center_id: healthCenterId,
      medicine_id: medicineId,
      updated_at: { [Op.gte]: startDate }
    },
    order: [['updated_at', 'ASC']]
  });
}

async function getHistoricalDemandData(medicineId, region, days) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return await Transaction.findAll({
    where: {
      created_at: { [Op.gte]: startDate }
    },
    include: [{
      model: HealthCenter,
      as: 'toCenter',
      where: { region }
    }, {
      model: Batch,
      where: { medicine_id: medicineId }
    }],
    order: [['created_at', 'ASC']]
  });
}

function prepareStockFeatures(historicalData) {
  // Extraction des features pour le modèle
  const features = [
    historicalData.length,
    historicalData[historicalData.length - 1]?.quantity || 0,
    calculateAverageConsumption(historicalData),
    calculateStockVariability(historicalData),
    getDayOfWeek(),
    getMonthOfYear(),
    getSeasonalFactor(),
    calculateTrend(historicalData),
    calculateVolatility(historicalData),
    getExternalFactors()
  ];
  
  return features;
}

function prepareDemandSequences(demandData) {
  const sequences = [];
  const sequenceLength = 30;
  
  for (let i = sequenceLength; i < demandData.length; i++) {
    const sequence = demandData.slice(i - sequenceLength, i).map(d => [
      d.quantity,
      getDayOfWeek(d.created_at),
      getMonthOfYear(d.created_at),
      getSeasonalFactor(d.created_at),
      getExternalFactors(d.created_at)
    ]);
    sequences.push(sequence);
  }
  
  return sequences[sequences.length - 1] || [];
}

function calculatePredictionConfidence(historicalData) {
  // Calcul de la confiance basé sur la variabilité des données
  const variance = calculateStockVariability(historicalData);
  return Math.max(0.1, Math.min(0.95, 1 - (variance / 100)));
}

function getStockRecommendation(predictedStock, historicalData) {
  const currentStock = historicalData[historicalData.length - 1]?.quantity || 0;
  const averageConsumption = calculateAverageConsumption(historicalData);
  
  if (predictedStock < averageConsumption * 7) {
    return {
      action: 'urgent_restock',
      priority: 'high',
      message: 'Stock critique - Réapprovisionnement urgent nécessaire'
    };
  } else if (predictedStock < averageConsumption * 14) {
    return {
      action: 'restock',
      priority: 'medium',
      message: 'Réapprovisionnement recommandé dans les prochains jours'
    };
  } else if (predictedStock > averageConsumption * 60) {
    return {
      action: 'redistribute',
      priority: 'low',
      message: 'Stock excédentaire - Redistribution possible'
    };
  }
  
  return {
    action: 'maintain',
    priority: 'low',
    message: 'Stock optimal'
  };
}

function calculateAverageConsumption(data) {
  if (data.length < 2) return 0;
  
  let totalConsumption = 0;
  for (let i = 1; i < data.length; i++) {
    const consumption = Math.max(0, data[i-1].quantity - data[i].quantity);
    totalConsumption += consumption;
  }
  
  return totalConsumption / (data.length - 1);
}

function calculateStockVariability(data) {
  if (data.length < 2) return 0;
  
  const quantities = data.map(d => d.quantity);
  const mean = quantities.reduce((a, b) => a + b, 0) / quantities.length;
  const variance = quantities.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / quantities.length;
  
  return Math.sqrt(variance);
}

function getDayOfWeek(date = new Date()) {
  return date.getDay() / 6; // Normalisation 0-1
}

function getMonthOfYear(date = new Date()) {
  return date.getMonth() / 11; // Normalisation 0-1
}

function getSeasonalFactor(date = new Date()) {
  const month = date.getMonth();
  // Facteur saisonnier pour l'Afrique de l'Ouest
  const seasonalFactors = [0.8, 0.7, 0.9, 1.2, 1.5, 1.3, 1.1, 1.0, 1.2, 1.4, 1.1, 0.9];
  return seasonalFactors[month];
}

function getExternalFactors(date = new Date()) {
  // Facteurs externes (épidémies, événements, etc.)
  // À implémenter selon les données disponibles
  return 1.0;
}

function calculateTrend(data) {
  if (data.length < 3) return 0;
  
  const recent = data.slice(-7);
  const older = data.slice(-14, -7);
  
  const recentAvg = recent.reduce((a, b) => a + b.quantity, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b.quantity, 0) / older.length;
  
  return (recentAvg - olderAvg) / olderAvg;
}

function calculateVolatility(data) {
  if (data.length < 2) return 0;
  
  const changes = [];
  for (let i = 1; i < data.length; i++) {
    const change = (data[i].quantity - data[i-1].quantity) / data[i-1].quantity;
    changes.push(change);
  }
  
  const mean = changes.reduce((a, b) => a + b, 0) / changes.length;
  const variance = changes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / changes.length;
  
  return Math.sqrt(variance);
}

export async function trainModels() {
  try {
    logger.info('Début de l\'entraînement des modèles IA');
    
    // Récupération des données d'entraînement
    const trainingData = await prepareTrainingData();
    
    if (trainingData.stockData.length > 100) {
      await trainStockPredictionModel(trainingData.stockData);
    }
    
    if (trainingData.demandData.length > 100) {
      await trainDemandForecastModel(trainingData.demandData);
    }
    
    logger.info('Entraînement des modèles terminé');
    
  } catch (error) {
    logger.error('Erreur lors de l\'entraînement des modèles:', error);
    throw error;
  }
}

async function prepareTrainingData() {
  // Préparation des données d'entraînement à partir de la base de données
  const stockData = await Stock.findAll({
    include: [Medicine, HealthCenter],
    order: [['updated_at', 'ASC']]
  });
  
  const demandData = await Transaction.findAll({
    include: [Batch, HealthCenter],
    order: [['created_at', 'ASC']]
  });
  
  return { stockData, demandData };
}

async function trainStockPredictionModel(data) {
  // Implémentation de l'entraînement du modèle de prédiction des stocks
  // À compléter selon les besoins spécifiques
}

async function trainDemandForecastModel(data) {
  // Implémentation de l'entraînement du modèle de prévision de la demande
  // À compléter selon les besoins spécifiques
}