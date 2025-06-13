import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

export const HealthCenter = sequelize.define('HealthCenter', {
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
  type: {
    type: DataTypes.ENUM('hospital', 'clinic', 'pharmacy', 'health_post', 'distributor', 'manufacturer'),
    allowNull: false
  },
  license_number: {
    type: DataTypes.STRING,
    unique: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Sénégal'
  },
  postal_code: {
    type: DataTypes.STRING
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8)
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      is: /^[+]?[0-9\s\-\(\)]+$/
    }
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  website: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true
    }
  },
  director_name: {
    type: DataTypes.STRING
  },
  director_phone: {
    type: DataTypes.STRING
  },
  director_email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  capacity_beds: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  },
  services_offered: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  operating_hours: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  emergency_contact: {
    type: DataTypes.STRING
  },
  storage_capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 1000
  },
  cold_storage_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cold_storage_capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  certification_status: {
    type: DataTypes.ENUM('pending', 'certified', 'suspended', 'revoked'),
    defaultValue: 'pending'
  },
  certification_date: {
    type: DataTypes.DATE
  },
  certification_expiry: {
    type: DataTypes.DATE
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  hedera_account_id: {
    type: DataTypes.STRING,
    unique: true
  },
  last_inspection_date: {
    type: DataTypes.DATE
  },
  next_inspection_date: {
    type: DataTypes.DATE
  },
  compliance_score: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  tableName: 'health_centers',
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['type']
    },
    {
      fields: ['city']
    },
    {
      fields: ['region']
    },
    {
      fields: ['license_number']
    },
    {
      fields: ['certification_status']
    }
  ]
});