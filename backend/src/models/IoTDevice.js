import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

export const IoTDevice = sequelize.define('IoTDevice', {
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
  device_type: {
    type: DataTypes.ENUM('temperature', 'humidity', 'gps', 'scanner', 'custom'),
    allowNull: false
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'faulty'),
    defaultValue: 'active'
  },
  last_reading: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'iot_devices',
  timestamps: true,
  indexes: [
    { fields: ['health_center_id'] },
    { fields: ['device_type'] },
    { fields: ['status'] },
    { fields: ['device_id'] }
  ]
});
