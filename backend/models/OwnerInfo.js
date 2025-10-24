const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OwnerInfo = sequelize.define('OwnerInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Owner/Team member name (English)'
  },
  name_hi: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Owner/Team member name (Hindi)',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g., Founder & CEO, Director (English)'
  },
  designation_hi: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Designation (Hindi)',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,  // Make bio optional too
    comment: 'Biography or description (English)'
  },
  bio_hi: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Biography or description (Hindi)',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Profile photo URL'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Display order (lower first)'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Show/hide on website'
  }
}, {
  tableName: 'owner_info',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = OwnerInfo;

