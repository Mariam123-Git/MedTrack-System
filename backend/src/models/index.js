import { sequelize } from '../database/connection.js';
import { User } from './User.js';
import { Medicine } from './Medicine.js';
import { Batch } from './Batch.js';
import { Transaction } from './Transaction.js';
import { HealthCenter } from './HealthCenter.js';
import { Stock } from './Stock.js';
import { IoTDevice } from './IoTDevice.js';
import { Alert } from './Alert.js';
import { Report } from './Report.js';

// Définition des associations
function setupAssociations() {
  // User associations
  User.hasMany(Transaction, { foreignKey: 'user_id' });
  User.belongsTo(HealthCenter, { foreignKey: 'health_center_id' });

  // Medicine associations
  Medicine.hasMany(Batch, { foreignKey: 'medicine_id' });
  Medicine.hasMany(Stock, { foreignKey: 'medicine_id' });

  // Batch associations
  Batch.belongsTo(Medicine, { foreignKey: 'medicine_id' });
  Batch.hasMany(Transaction, { foreignKey: 'batch_id' });
  Batch.hasMany(Stock, { foreignKey: 'batch_id' });

  // Transaction associations
  Transaction.belongsTo(User, { foreignKey: 'user_id' });
  Transaction.belongsTo(Batch, { foreignKey: 'batch_id' });
  Transaction.belongsTo(HealthCenter, { foreignKey: 'from_center_id', as: 'fromCenter' });
  Transaction.belongsTo(HealthCenter, { foreignKey: 'to_center_id', as: 'toCenter' });

  // HealthCenter associations
  HealthCenter.hasMany(User, { foreignKey: 'health_center_id' });
  HealthCenter.hasMany(Stock, { foreignKey: 'health_center_id' });
  HealthCenter.hasMany(IoTDevice, { foreignKey: 'health_center_id' });
  HealthCenter.hasMany(Transaction, { foreignKey: 'from_center_id', as: 'outgoingTransactions' });
  HealthCenter.hasMany(Transaction, { foreignKey: 'to_center_id', as: 'incomingTransactions' });

  // Stock associations
  Stock.belongsTo(Medicine, { foreignKey: 'medicine_id' });
  Stock.belongsTo(Batch, { foreignKey: 'batch_id' });
  Stock.belongsTo(HealthCenter, { foreignKey: 'health_center_id' });

  // IoTDevice associations
  IoTDevice.belongsTo(HealthCenter, { foreignKey: 'health_center_id' });

  // Alert associations
  Alert.belongsTo(HealthCenter, { foreignKey: 'health_center_id' });
  Alert.belongsTo(Medicine, { foreignKey: 'medicine_id' });

  // Report associations
  Report.belongsTo(User, { foreignKey: 'created_by' });
  Report.belongsTo(HealthCenter, { foreignKey: 'health_center_id' });
}

setupAssociations();

export {
  sequelize,
  User,
  Medicine,
  Batch,
  Transaction,
  HealthCenter,
  Stock,
  IoTDevice,
  Alert,
  Report
};