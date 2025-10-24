const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Inquiry = sequelize.define('Inquiry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Optional: Link to registered user (if logged in)'
  },
  plot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'plots',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Customer name'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Customer phone number'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Customer email (optional - many people in India don\'t have email)'
  },
  status: {
    type: DataTypes.ENUM('inquired', 'in_progress', 'booked', 'closed', 'cancelled'),
    defaultValue: 'inquired',
    comment: 'inquired: New inquiry, in_progress: Admin contacted/discussing, booked: Customer paid advance, closed: Deal done or not interested, cancelled: Customer cancelled'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Optional message/requirements from customer'
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes for admin tracking'
  }
}, {
  tableName: 'inquiries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Inquiry;

