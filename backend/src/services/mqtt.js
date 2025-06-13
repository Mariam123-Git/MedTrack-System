import mqtt from 'mqtt';
import { logger } from '../utils/logger.js';
import { IoTDevice, Stock, Alert } from '../models/index.js';
import { io } from '../server.js';

let mqttClient;

export async function initializeMQTT() {
  try {
    const options = {
      host: process.env.MQTT_BROKER_URL || 'localhost',
      port: 1883,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      clientId: `medtrack_server_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    };

    mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, options);

    mqttClient.on('connect', () => {
      logger.info('✅ Connexion MQTT établie');
      
      // Souscription aux topics IoT
      const topics = [
        'medtrack/+/temperature',
        'medtrack/+/humidity',
        'medtrack/+/stock',
        'medtrack/+/alert',
        'medtrack/+/status'
      ];
      
      topics.forEach(topic => {
        mqttClient.subscribe(topic, (err) => {
          if (err) {
            logger.error(`Erreur souscription topic ${topic}:`, err);
          } else {
            logger.info(`Souscrit au topic: ${topic}`);
          }
        });
      });
    });

    mqttClient.on('message', handleMQTTMessage);

    mqttClient.on('error', (error) => {
      logger.error('Erreur MQTT:', error);
    });

    mqttClient.on('close', () => {
      logger.warn('Connexion MQTT fermée');
    });

    mqttClient.on('reconnect', () => {
      logger.info('Reconnexion MQTT...');
    });

    return mqttClient;

  } catch (error) {
    logger.error('Erreur lors de l\'initialisation MQTT:', error);
    throw error;
  }
}

async function handleMQTTMessage(topic, message) {
  try {
    const data = JSON.parse(message.toString());
    const topicParts = topic.split('/');
    const deviceId = topicParts[1];
    const messageType = topicParts[2];

    logger.info(`Message MQTT reçu - Device: ${deviceId}, Type: ${messageType}`);

    // Vérification de l'existence du device
    const device = await IoTDevice.findOne({ where: { device_id: deviceId } });
    if (!device) {
      logger.warn(`Device IoT non trouvé: ${deviceId}`);
      return;
    }

    switch (messageType) {
      case 'temperature':
        await handleTemperatureData(device, data);
        break;
      case 'humidity':
        await handleHumidityData(device, data);
        break;
      case 'stock':
        await handleStockData(device, data);
        break;
      case 'alert':
        await handleAlertData(device, data);
        break;
      case 'status':
        await handleStatusData(device, data);
        break;
      default:
        logger.warn(`Type de message MQTT non géré: ${messageType}`);
    }

    // Mise à jour du dernier contact du device
    await device.update({ last_contact: new Date() });

  } catch (error) {
    logger.error('Erreur lors du traitement du message MQTT:', error);
  }
}

async function handleTemperatureData(device, data) {
  try {
    const { temperature, timestamp } = data;
    
    // Mise à jour des données du device
    await device.update({
      current_temperature: temperature,
      temperature_log: [
        ...device.temperature_log.slice(-99), // Garder les 100 dernières mesures
        { temperature, timestamp: timestamp || new Date() }
      ]
    });

    // Vérification des seuils de température
    if (temperature < device.min_temperature || temperature > device.max_temperature) {
      await createTemperatureAlert(device, temperature);
    }

    // Diffusion en temps réel via Socket.IO
    io.to(`health_center_${device.health_center_id}`).emit('temperature_update', {
      deviceId: device.device_id,
      temperature,
      timestamp: timestamp || new Date(),
      status: getTemperatureStatus(temperature, device)
    });

  } catch (error) {
    logger.error('Erreur lors du traitement des données de température:', error);
  }
}

async function handleHumidityData(device, data) {
  try {
    const { humidity, timestamp } = data;
    
    await device.update({
      current_humidity: humidity,
      humidity_log: [
        ...device.humidity_log.slice(-99),
        { humidity, timestamp: timestamp || new Date() }
      ]
    });

    // Vérification des seuils d'humidité
    if (humidity < device.min_humidity || humidity > device.max_humidity) {
      await createHumidityAlert(device, humidity);
    }

    io.to(`health_center_${device.health_center_id}`).emit('humidity_update', {
      deviceId: device.device_id,
      humidity,
      timestamp: timestamp || new Date(),
      status: getHumidityStatus(humidity, device)
    });

  } catch (error) {
    logger.error('Erreur lors du traitement des données d\'humidité:', error);
  }
}

async function handleStockData(device, data) {
  try {
    const { medicineId, quantity, timestamp } = data;
    
    // Mise à jour automatique du stock
    const stock = await Stock.findOne({
      where: {
        health_center_id: device.health_center_id,
        medicine_id: medicineId
      }
    });

    if (stock) {
      await stock.update({
        quantity,
        last_updated_by: 'iot_device',
        last_iot_update: timestamp || new Date()
      });

      // Notification de mise à jour de stock
      io.to(`health_center_${device.health_center_id}`).emit('stock_update', {
        medicineId,
        quantity,
        timestamp: timestamp || new Date(),
        source: 'iot'
      });

      logger.info(`Stock mis à jour automatiquement - Medicine: ${medicineId}, Quantity: ${quantity}`);
    }

  } catch (error) {
    logger.error('Erreur lors du traitement des données de stock:', error);
  }
}

async function handleAlertData(device, data) {
  try {
    const { alertType, severity, message, timestamp } = data;
    
    // Création d'une alerte
    const alert = await Alert.create({
      type: alertType,
      severity,
      message,
      health_center_id: device.health_center_id,
      source: 'iot_device',
      device_id: device.device_id,
      is_resolved: false,
      created_at: timestamp || new Date()
    });

    // Notification immédiate
    io.to(`health_center_${device.health_center_id}`).emit('new_alert', {
      id: alert.id,
      type: alertType,
      severity,
      message,
      deviceId: device.device_id,
      timestamp: timestamp || new Date()
    });

    logger.warn(`Alerte IoT créée - Type: ${alertType}, Severity: ${severity}`);

  } catch (error) {
    logger.error('Erreur lors du traitement de l\'alerte IoT:', error);
  }
}

async function handleStatusData(device, data) {
  try {
    const { status, batteryLevel, signalStrength, timestamp } = data;
    
    await device.update({
      status,
      battery_level: batteryLevel,
      signal_strength: signalStrength,
      last_contact: timestamp || new Date()
    });

    // Alerte si batterie faible
    if (batteryLevel && batteryLevel < 20) {
      await createBatteryAlert(device, batteryLevel);
    }

    io.to(`health_center_${device.health_center_id}`).emit('device_status_update', {
      deviceId: device.device_id,
      status,
      batteryLevel,
      signalStrength,
      timestamp: timestamp || new Date()
    });

  } catch (error) {
    logger.error('Erreur lors du traitement du statut du device:', error);
  }
}

async function createTemperatureAlert(device, temperature) {
  const message = temperature < device.min_temperature 
    ? `Température trop basse: ${temperature}°C (min: ${device.min_temperature}°C)`
    : `Température trop élevée: ${temperature}°C (max: ${device.max_temperature}°C)`;

  await Alert.create({
    type: 'temperature_threshold',
    severity: 'high',
    message,
    health_center_id: device.health_center_id,
    source: 'iot_device',
    device_id: device.device_id,
    is_resolved: false
  });
}

async function createHumidityAlert(device, humidity) {
  const message = humidity < device.min_humidity 
    ? `Humidité trop basse: ${humidity}% (min: ${device.min_humidity}%)`
    : `Humidité trop élevée: ${humidity}% (max: ${device.max_humidity}%)`;

  await Alert.create({
    type: 'humidity_threshold',
    severity: 'medium',
    message,
    health_center_id: device.health_center_id,
    source: 'iot_device',
    device_id: device.device_id,
    is_resolved: false
  });
}

async function createBatteryAlert(device, batteryLevel) {
  await Alert.create({
    type: 'low_battery',
    severity: 'medium',
    message: `Batterie faible sur le capteur ${device.name}: ${batteryLevel}%`,
    health_center_id: device.health_center_id,
    source: 'iot_device',
    device_id: device.device_id,
    is_resolved: false
  });
}

function getTemperatureStatus(temperature, device) {
  if (temperature < device.min_temperature || temperature > device.max_temperature) {
    return 'critical';
  } else if (temperature < device.min_temperature + 2 || temperature > device.max_temperature - 2) {
    return 'warning';
  }
  return 'normal';
}

function getHumidityStatus(humidity, device) {
  if (humidity < device.min_humidity || humidity > device.max_humidity) {
    return 'critical';
  } else if (humidity < device.min_humidity + 5 || humidity > device.max_humidity - 5) {
    return 'warning';
  }
  return 'normal';
}

export function publishToDevice(deviceId, topic, message) {
  if (mqttClient && mqttClient.connected) {
    const fullTopic = `medtrack/${deviceId}/${topic}`;
    mqttClient.publish(fullTopic, JSON.stringify(message), (err) => {
      if (err) {
        logger.error(`Erreur publication MQTT vers ${fullTopic}:`, err);
      } else {
        logger.info(`Message publié vers ${fullTopic}`);
      }
    });
  } else {
    logger.error('Client MQTT non connecté');
  }
}

export { mqttClient };