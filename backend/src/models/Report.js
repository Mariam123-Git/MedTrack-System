import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

export const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
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
  report_type: {
    type: DataTypes.ENUM('incident', 'inventory', 'quality_control', 'distribution', 'other'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: true // optionnel : pour les fichiers PDF, images, etc.
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'reviewed', 'archived'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'reports',
  timestamps: true, // created_at et updated_at
  indexes: [
    { fields: ['report_type'] },
    { fields: ['created_by'] },
    { fields: ['health_center_id'] },
    { fields: ['status'] }
  ]
});
