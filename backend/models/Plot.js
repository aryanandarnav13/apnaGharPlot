const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Plot = sequelize.define('Plot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plot_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., Sector 45, Gurgaon'
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., 1200 sq ft, 150 sq yards'
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'booked', 'sold'),
    defaultValue: 'available'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array of image URLs'
  },
  videos: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array of video URLs'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  features: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON string of features'
  },
  map_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Google Maps embed URL'
  },
  map_lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  map_lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  show_price: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether to display price on website'
  },
  price_display: {
    type: DataTypes.ENUM('exact', 'masked', 'hidden'),
    defaultValue: 'exact',
    comment: 'Price display type: exact / masked / hidden'
  },
  contact_phone: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Custom contact phone for this plot (optional, falls back to owner contact)'
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Custom contact email for this plot (optional)'
  },
  contact_whatsapp: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Custom WhatsApp number for this plot (optional)'
  }
}, {
  tableName: 'plots',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Plot;

