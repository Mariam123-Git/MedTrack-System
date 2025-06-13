import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

export const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  batch_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'batches',
      key: 'id'
    }
  },
  from_center_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'health_centers',
      key: 'id'
    }
  },
  to_center_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'health_centers',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  transaction_type: {
    type: DataTypes.ENUM('shipment', 'receipt', 'return', 'disposal', 'transfer'),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  blockchain_tx_hash: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['batch_id'] },
    { fields: ['from_center_id'] },
    { fields: ['to_center_id'] },
    { fields: ['transaction_type'] },
    { fields: ['status'] }
  ]
});
