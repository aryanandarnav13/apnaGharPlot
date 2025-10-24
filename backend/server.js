const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const plotRoutes = require('./routes/plots');
const houseDesignRoutes = require('./routes/houseDesigns');
const inquiryRoutes = require('./routes/inquiries');
const uploadRoutes = require('./routes/upload');
const ownerInfoRoutes = require('./routes/ownerInfo');
const settingsRoutes = require('./routes/settings');

// Initialize express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));

// Connect to database
connectDB();

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/house-designs', houseDesignRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/owner-info', ownerInfoRoutes);
app.use('/api/settings', settingsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ApnaGhar Plots API',
    version: '1.0.0'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Migration route to fix email column
app.get('/migrate/fix-email', async (req, res) => {
  try {
    await sequelize.query(`
      ALTER TABLE inquiries 
      MODIFY COLUMN email VARCHAR(255) NULL 
      COMMENT 'Customer email (optional - many people in India don\\'t have email)'
    `);
    res.json({
      success: true,
      message: 'Email column fixed successfully! Now it can be null.'
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Migration route to update price_display enum (remove 'range', add 'masked')
app.get('/migrate/fix-price-display', async (req, res) => {
  try {
    await sequelize.query(`
      ALTER TABLE plots 
      MODIFY COLUMN price_display ENUM('exact', 'masked', 'hidden') 
      DEFAULT 'exact' 
      COMMENT 'How to display price: exact amount, masked (25xxxxx), or hidden'
    `);
    res.json({
      success: true,
      message: 'Price display column updated successfully! Now supports exact, masked, and hidden options.'
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;

