import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';
import bcrypt from 'bcryptjs';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      is: /^[+]?[0-9\s\-\(\)]+$/
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'pharmacist', 'doctor', 'patient', 'manufacturer', 'distributor'),
    allowNull: false,
    defaultValue: 'patient'
  },
  health_center_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'health_centers',
      key: 'id'
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE
  },
  profile_picture: {
    type: DataTypes.STRING
  },
  hedera_account_id: {
    type: DataTypes.STRING,
    unique: true
  },
  verification_token: {
    type: DataTypes.STRING
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reset_password_token: {
    type: DataTypes.STRING
  },
  reset_password_expires: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS));
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS));
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Méthodes d'instance
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.verification_token;
  delete values.reset_password_token;
  return values;
};