const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Setting key (e.g., default_language)'
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Setting value (JSON or plain text)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description of what this setting does'
  }
}, {
  tableName: 'settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Settings;

