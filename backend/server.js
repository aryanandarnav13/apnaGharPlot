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

// Seed database route (for initial setup only)
app.get('/seed-database', async (req, res) => {
  try {
    const { User, Plot, HouseDesign, Inquiry, OwnerInfo, Settings } = require('./models');
    
    console.log('🌱 Starting database seeding via endpoint...');

    // Check if already fully seeded (check for plots instead of users)
    const plotCount = await Plot.count();
    const settingsCount = await Settings.count();
    
    if (plotCount > 0 && settingsCount > 0) {
      return res.json({
        success: true,
        message: 'Database already fully seeded!',
        note: 'Admin credentials: admin@example.com / password123',
        data: {
          plots: plotCount,
          settings: settingsCount
        }
      });
    }

    // Sync database (create tables if they don't exist, but don't alter existing ones)
    await sequelize.sync({ force: false });
    console.log('✅ Database synced');

    // Create Admin User (check if exists first)
    let adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        phone: '9876543210',
        role: 'admin'
      });
    }

    // Create Regular Users (check if exist first)
    let user1 = await User.findOne({ where: { email: 'rahul@example.com' } });
    if (!user1) {
      user1 = await User.create({
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'password123',
        phone: '9876543211',
        role: 'user'
      });
    }

    let user2 = await User.findOne({ where: { email: 'priya@example.com' } });
    if (!user2) {
      user2 = await User.create({
        name: 'Priya Verma',
        email: 'priya@example.com',
        password: 'password123',
        phone: '9876543212',
        role: 'user'
      });
    }
    console.log('✅ Users checked/created');

    // Create Plots
    const plots = await Plot.bulkCreate([
      {
        plot_number: 'A-101',
        location: 'Sector 45, Patna, Bihar',
        size: '1200 sq ft',
        price: 2500000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600',
        images: JSON.stringify(['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800','https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800','https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800']),
        videos: JSON.stringify(['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']),
        description: 'Corner plot with road on two sides',
        features: JSON.stringify(['Corner Plot', 'Road on Two Sides', 'Water Connection']),
        map_lat: 25.5941,
        map_lng: 85.1376,
        show_price: true,
        price_display: 'exact'
      },
      {
        plot_number: 'A-102',
        location: 'Rajgir Road, Patna, Bihar',
        size: '1500 sq ft',
        price: 3200000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600',
        images: JSON.stringify(['https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800']),
        description: 'Spacious plot with garden area',
        features: JSON.stringify(['Spacious', 'Garden Area', 'Water Connection']),
        map_lat: 25.5941,
        map_lng: 85.1376,
        show_price: true,
        price_display: 'masked'
      },
      {
        plot_number: 'A-103',
        location: 'Boring Road, Patna, Bihar',
        size: '1800 sq ft',
        price: 3800000,
        status: 'booked',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
        images: JSON.stringify(['https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800']),
        description: 'Premium plot with park view',
        features: JSON.stringify(['Park View', 'Premium Location']),
        map_lat: 25.5941,
        map_lng: 85.1376,
        show_price: false,
        price_display: 'hidden'
      },
      {
        plot_number: 'B-201',
        location: 'Bailey Road, Patna, Bihar',
        size: '2000 sq ft',
        price: 4200000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        images: JSON.stringify(['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800','https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800']),
        description: 'Large plot suitable for luxury villa',
        features: JSON.stringify(['Large Area', 'Park Nearby']),
        map_lat: 25.5941,
        map_lng: 85.1376,
        show_price: true,
        price_display: 'exact'
      },
      {
        plot_number: 'B-202',
        location: 'Kankarbagh, Patna, Bihar',
        size: '1000 sq ft',
        price: 2100000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
        images: JSON.stringify(['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800']),
        description: 'Compact plot perfect for modern home',
        features: JSON.stringify(['Compact', 'Modern Area']),
        map_lat: 25.5941,
        map_lng: 85.1376,
        show_price: true,
        price_display: 'masked'
      }
    ]);
    console.log('✅ Plots created');

    // Create House Designs
    await HouseDesign.bulkCreate([
      { plot_id: plots[0].id, image: 'https://images.unsplash.com/photo-1568605114258-295458900270?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1568605114258-295458900270?w=800']), estimated_construction_cost: 1500000 },
      { plot_id: plots[0].id, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2fe?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1570129477492-45c003edd2fe?w=800']), estimated_construction_cost: 1800000 },
      { plot_id: plots[1].id, image: 'https://images.unsplash.com/photo-1582268611958-ab5d8124d16a?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1582268611958-ab5d8124d16a?w=800']), estimated_construction_cost: 2000000 }
    ]);
    console.log('✅ House designs created');

    // Create Inquiries
    await Inquiry.bulkCreate([
      { user_id: null, plot_id: plots[2].id, name: 'Rahul Kumar', phone: '+91 9876543211', email: null, status: 'booked', message: 'Very interested in this plot' },
      { user_id: null, plot_id: plots[0].id, name: 'Priya Singh', phone: '+91 9876543212', email: null, status: 'in_progress', message: 'Would like to know more details' },
      { user_id: null, plot_id: plots[3].id, name: 'Amit Sharma', phone: '+91 9876543213', email: null, status: 'inquired', message: 'Interested in this plot' }
    ]);
    console.log('✅ Inquiries created');

    // Create Owner Info
    const ownerCount = await OwnerInfo.count();
    if (ownerCount === 0) {
      await OwnerInfo.create({
        name: 'Deepak Kumar Singh',
        name_hi: 'दीपक कुमार सिंह',
        designation: 'Founder & CEO',
        designation_hi: 'संस्थापक और सीईओ',
        bio: 'With over 15 years of experience in real estate, Deepak Kumar Singh founded ApnaGhar Plots LLP to help families achieve their dream of owning land.',
        bio_hi: 'रियल एस्टेट में 15 वर्षों से अधिक के अनुभव के साथ, दीपक कुमार सिंह ने परिवारों को जमीन खरीदने के सपने को पूरा करने में मदद करने के लिए ApnaGhar Plots LLP की स्थापना की।',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        order: 1,
        is_active: true
      });
      console.log('✅ Owner info created');
    } else {
      console.log('ℹ️ Owner info already exists');
    }

    // Create Settings (check if exist first)
    const settingsData = [
      { key: 'default_language', value: 'hi', description: 'Default language (hi = Hindi, en = English)' },
      { key: 'default_contact_phone', value: '+91 9876543210', description: 'Default contact phone' },
      { key: 'default_contact_email', value: 'contact@apnagharplots.com', description: 'Default contact email' },
      { key: 'default_contact_whatsapp', value: '+919876543210', description: 'Default WhatsApp number' }
    ];
    
    for (const setting of settingsData) {
      const exists = await Settings.findOne({ where: { key: setting.key } });
      if (!exists) {
        await Settings.create(setting);
      }
    }
    console.log('✅ Settings created/checked');

    res.json({
      success: true,
      message: '🎉 Database fully seeded!',
      data: {
        users: 3,
        plots: 5,
        houseDesigns: 3,
        inquiries: 3,
        ownerInfo: 1,
        settings: 4
      },
      credentials: {
        admin: 'admin@example.com / password123',
        user1: 'rahul@example.com / password123',
        user2: 'priya@example.com / password123'
      }
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
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

