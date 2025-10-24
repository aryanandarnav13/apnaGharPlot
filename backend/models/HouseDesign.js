const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const HouseDesign = sequelize.define('HouseDesign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'plots',
      key: 'id'
    },
    comment: 'Link to specific plot'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Primary house design image'
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array of additional house design image URLs'
  },
  estimated_construction_cost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Estimated cost to build this house design'
  }
}, {
  tableName: 'house_designs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = HouseDesign;

