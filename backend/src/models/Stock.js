import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

export const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  medicine_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'medicines',
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
  health_center_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'health_centers',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  last_updated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'stocks',
  timestamps: true, // gère created_at et updated_at automatiquement
  indexes: [
    { fields: ['medicine_id'] },
    { fields: ['batch_id'] },
    { fields: ['health_center_id'] }
  ],
  hooks: {
    beforeUpdate: (stock) => {
      stock.last_updated = new Date();
    }
  }
});
