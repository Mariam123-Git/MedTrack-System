import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

export const Medicine = sequelize.define('Medicine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  generic_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'antibiotics', 'analgesics', 'vaccines', 'antimalarials', 
      'cardiovascular', 'diabetes', 'respiratory', 'other'
    ),
    allowNull: false
  },
  dosage_form: {
    type: DataTypes.ENUM('tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops'),
    allowNull: false
  },
  strength: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  side_effects: {
    type: DataTypes.TEXT
  },
  contraindications: {
    type: DataTypes.TEXT
  },
  storage_conditions: {
    type: DataTypes.STRING
  },
  therapeutic_class: {
    type: DataTypes.STRING
  },
  atc_code: {
    type: DataTypes.STRING
  },
  price_per_unit: {
    type: DataTypes.DECIMAL(10, 2)
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'XOF'
  },
  requires_prescription: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_controlled_substance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  minimum_stock_level: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  maximum_stock_level: {
    type: DataTypes.INTEGER,
    defaultValue: 1000
  },
  image_url: {
    type: DataTypes.STRING
  },
  barcode: {
    type: DataTypes.STRING,
    unique: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'medicines',
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['generic_name']
    },
    {
      fields: ['manufacturer']
    },
    {
      fields: ['category']
    },
    {
      fields: ['barcode']
    }
  ]
});