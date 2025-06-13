import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

export const Batch = sequelize.define('Batch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  batch_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  medicine_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'medicines',
      key: 'id'
    }
  },
  manufacturing_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  quantity_manufactured: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  quantity_remaining: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  unit_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  manufacturing_location: {
    type: DataTypes.STRING
  },
  quality_control_status: {
    type: DataTypes.ENUM('pending', 'passed', 'failed', 'recalled'),
    defaultValue: 'pending'
  },
  quality_control_date: {
    type: DataTypes.DATE
  },
  quality_control_notes: {
    type: DataTypes.TEXT
  },
  hedera_token_id: {
    type: DataTypes.STRING,
    unique: true
  },
  hedera_nft_serial: {
    type: DataTypes.STRING
  },
  blockchain_hash: {
    type: DataTypes.STRING
  },
  qr_code: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'recalled', 'depleted'),
    defaultValue: 'active'
  },
  recall_reason: {
    type: DataTypes.TEXT
  },
  recall_date: {
    type: DataTypes.DATE
  },
  temperature_log: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  humidity_log: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  gps_coordinates: {
    type: DataTypes.JSONB
  }
}, {
  tableName: 'batches',
  indexes: [
    {
      fields: ['batch_number']
    },
    {
      fields: ['medicine_id']
    },
    {
      fields: ['expiry_date']
    },
    {
      fields: ['status']
    },
    {
      fields: ['hedera_token_id']
    }
  ],
  hooks: {
    beforeUpdate: (batch) => {
      // Mettre à jour le statut si expiré
      if (batch.expiry_date < new Date() && batch.status === 'active') {
        batch.status = 'expired';
      }
      
      // Mettre à jour le statut si épuisé
      if (batch.quantity_remaining === 0 && batch.status === 'active') {
        batch.status = 'depleted';
      }
    }
  }
});