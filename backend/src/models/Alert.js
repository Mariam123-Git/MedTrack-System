import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

export const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  health_center_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'health_centers',
      key: 'id'
    }
  },
  medicine_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'medicines',
      key: 'id'
    }
  },
  alert_type: {
    type: DataTypes.ENUM('stock_low', 'temperature_alert', 'humidity_alert', 'fake_drug_detected', 'other'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'resolved', 'ignored'),
    defaultValue: 'open'
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'alerts',
  timestamps: true, // createdAt & updatedAt
  indexes: [
    { fields: ['alert_type'] },
    { fields: ['health_center_id'] },
    { fields: ['medicine_id'] },
    { fields: ['status'] }
  ]
});
