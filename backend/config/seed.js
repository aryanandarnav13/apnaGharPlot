const { sequelize } = require('./db');
const { User, Plot, HouseDesign, Inquiry, OwnerInfo, Settings } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop tables manually in correct order
    await sequelize.query('DROP TABLE IF EXISTS `inquiries`');
    await sequelize.query('DROP TABLE IF EXISTS `bookings`');
    await sequelize.query('DROP TABLE IF EXISTS `house_designs`');
    await sequelize.query('DROP TABLE IF EXISTS `owner_info`');
    await sequelize.query('DROP TABLE IF EXISTS `settings`');
    await sequelize.query('DROP TABLE IF EXISTS `plots`');
    await sequelize.query('DROP TABLE IF EXISTS `users`');

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Sync database (recreate all tables)
    await sequelize.sync();
    console.log('✅ Database synced');

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      phone: '9876543210',
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // Create Regular Users
    const user1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'password123',
      phone: '9876543211',
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Priya Verma',
      email: 'priya@example.com',
      password: 'password123',
      phone: '9876543212',
      role: 'user'
    });
    console.log('✅ Regular users created');

    // Create Plots with multiple images and videos
    const plots = await Plot.bulkCreate([
      {
        plot_number: 'A-101',
        location: 'Sector 45, Patna, Bihar',
        size: '1200 sq ft',
        price: 2500000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
          'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800',
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
        ]),
        videos: JSON.stringify([
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        ]),
        description: 'Corner plot with road on two sides, perfect for residential construction. Watch the video tour to see the full property!',
        features: JSON.stringify(['Corner Plot', 'Road on Two Sides', 'Water Connection', 'Electricity Available', 'Video Tour Available']),
        map_lat: 25.5941,
        map_lng: 85.1376,
        map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224357.30587!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1fb0!2sPatna%2C+Bihar!5e0!3m2!1sen!2sin!4v1234567890',
        show_price: true,
        price_display: 'exact',
        contact_phone: '+91 9876543210',
        contact_email: 'contact@apnagharplots.com',
        contact_whatsapp: '+919876543210'
      },
      {
        plot_number: 'A-102',
        location: 'Rajgir Road, Patna, Bihar',
        size: '1500 sq ft',
        price: 3200000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
        ]),
        videos: JSON.stringify([
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        ]),
        description: 'Spacious plot with garden area, ideal for family villa. Multiple images and video walkthrough available.',
        features: JSON.stringify(['Spacious', 'Garden Area', 'Water Connection', 'Electricity Available', 'Video Walkthrough']),
        map_lat: 25.5941,
        map_lng: 85.1376,
        map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224357.30587!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1fb0!2sPatna%2C+Bihar!5e0!3m2!1sen!2sin!4v1234567890',
        show_price: true,
        price_display: 'masked',
        contact_phone: '+91 9876543210',
        contact_email: null,
        contact_whatsapp: '+919876543210'
      },
      {
        plot_number: 'A-103',
        location: 'Boring Road, Patna, Bihar',
        size: '1800 sq ft',
        price: 3800000,
        status: 'booked',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
          'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800',
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
        ]),
        description: 'Premium plot with park view in prime location',
        features: JSON.stringify(['Park View', 'Premium Location', 'Water Connection', 'Electricity Available']),
        map_lat: 25.5941,
        map_lng: 85.1376,
        map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224357.30587!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1fb0!2sPatna%2C+Bihar!5e0!3m2!1sen!2sin!4v1234567890',
        show_price: false,
        price_display: 'hidden',
        contact_phone: '+91 9876543299',
        contact_email: 'premium@apnagharplots.com',
        contact_whatsapp: '+919876543299'
      },
      {
        plot_number: 'B-201',
        location: 'Bailey Road, Patna, Bihar',
        size: '2000 sq ft',
        price: 4200000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
          'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
        ]),
        videos: JSON.stringify([
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
        ]),
        description: 'Large plot suitable for luxury villa construction. Extensive photo gallery and multiple video tours available!',
        features: JSON.stringify(['Large Area', 'Luxury Location', 'Water Connection', 'Electricity Available', 'Park Nearby', '2 Video Tours']),
        map_lat: 25.5941,
        map_lng: 85.1376,
        map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224357.30587!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1fb0!2sPatna%2C+Bihar!5e0!3m2!1sen!2sin!4v1234567890',
        show_price: true,
        price_display: 'exact',
        contact_phone: null,
        contact_email: null,
        contact_whatsapp: null
      },
      {
        plot_number: 'B-202',
        location: 'Kankarbagh, Patna, Bihar',
        size: '1000 sq ft',
        price: 2100000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
        ]),
        videos: JSON.stringify([
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
        ]),
        description: 'Compact plot perfect for modern home. Check out our video tour!',
        features: JSON.stringify(['Compact', 'Modern Area', 'Water Connection', 'Electricity Available', 'Video Tour']),
        map_lat: 25.5941,
        map_lng: 85.1376,
        show_price: true,
        price_display: 'masked',
        contact_phone: null,
        contact_email: null,
        contact_whatsapp: null,
        map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224357.30587!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1fb0!2sPatna%2C+Bihar!5e0!3m2!1sen!2sin!4v1234567890'
      }
    ]);
    console.log('✅ Plots created');

    // Create House Designs (linked to specific plots)
    await HouseDesign.bulkCreate([
      // Plot A-101 (plots[0]) - 2 design options
      {
        plot_id: plots[0].id,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
        ]),
        estimated_construction_cost: 3500000
      },
      {
        plot_id: plots[0].id,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800'
        ]),
        estimated_construction_cost: 4200000
      },
      // Plot A-102 (plots[1]) - 1 design option
      {
        plot_id: plots[1].id,
        image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
          'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800',
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
        ]),
        estimated_construction_cost: 4500000
      },
      // Plot A-103 (plots[2]) - 2 design options
      {
        plot_id: plots[2].id,
        image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
          'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800'
        ]),
        estimated_construction_cost: 5000000
      },
      {
        plot_id: plots[2].id,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
        ]),
        estimated_construction_cost: 4800000
      },
      // Plot B-201 (plots[3]) - 3 design options
      {
        plot_id: plots[3].id,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'
        ]),
        estimated_construction_cost: 6000000
      },
      {
        plot_id: plots[3].id,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
        ]),
        estimated_construction_cost: 6500000
      },
      {
        plot_id: plots[3].id,
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
          'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800'
        ]),
        estimated_construction_cost: 5800000
      },
      // Plot B-202 (plots[4]) - 1 design option
      {
        plot_id: plots[4].id,
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
          'https://images.unsplash.com/photo-1600573472550-303c2ec5c74a?w=800'
        ]),
        estimated_construction_cost: 3200000
      }
    ]);
    console.log('✅ House designs created (9 designs linked to 5 plots)');

    // Create Sample Inquiries (no login required - just contact details)
    await Inquiry.create({
      user_id: null, // No login required
      plot_id: plots[2].id, // A-103 is booked
      name: 'Rahul Kumar',
      phone: '+91 9876543211',
      email: null, // No email - common in India
      status: 'booked',
      message: 'Very interested in this plot. Have completed initial payment.',
      admin_notes: 'First installment received. Documentation in progress.'
    });

    await Inquiry.create({
      user_id: null, // No login required
      plot_id: plots[0].id, // A-101
      name: 'Priya Singh',
      phone: '+91 9876543212',
      email: null, // No email
      status: 'in_progress',
      message: 'Would like to know more details about payment options.',
      admin_notes: 'Customer contacted. Discussed payment options. Follow-up scheduled.'
    });

    await Inquiry.create({
      user_id: null, // No login required
      plot_id: plots[3].id, // B-201
      name: 'Amit Sharma',
      phone: '+91 9876543213',
      email: null, // No email
      status: 'inquired',
      message: 'Interested in this plot. Please call to discuss.',
      admin_notes: null
    });

    console.log('✅ Sample inquiries created');

    // Create Owner Info
    await OwnerInfo.create({
      name: 'Deepak Kumar Singh',
      name_hi: 'दीपक कुमार सिंह',
      designation: 'Founder & CEO',
      designation_hi: 'संस्थापक और सीईओ',
      bio: 'With over 15 years of experience in real estate, Deepak Kumar Singh founded ApnaGhar Plots LLP to help families achieve their dream of owning land and building homes. His vision is to provide verified, legal, and affordable plots with complete transparency and customer satisfaction.',
      bio_hi: 'रियल एस्टेट में 15 वर्षों से अधिक के अनुभव के साथ, दीपक कुमार सिंह ने परिवारों को जमीन खरीदने और घर बनाने के उनके सपने को पूरा करने में मदद करने के लिए ApnaGhar Plots LLP की स्थापना की। उनका दृष्टिकोण पूर्ण पारदर्शिता और ग्राहक संतुष्टि के साथ सत्यापित, कानूनी और किफायती प्लॉट प्रदान करना है।',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      order: 1,
      is_active: true
    });
    console.log('✅ Owner info created');

    // Create Settings
    await Settings.bulkCreate([
      {
        key: 'default_language',
        value: 'hi',
        description: 'Default language for the website (hi = Hindi, en = English)'
      },
      {
        key: 'default_contact_phone',
        value: '+91 9876543210',
        description: 'Default contact phone number (used when plot-specific contact is not provided)'
      },
      {
        key: 'default_contact_email',
        value: 'contact@apnagharplots.com',
        description: 'Default contact email (used when plot-specific contact is not provided)'
      },
      {
        key: 'default_contact_whatsapp',
        value: '+919876543210',
        description: 'Default WhatsApp number (used when plot-specific contact is not provided)'
      }
    ]);
    console.log('✅ Settings created (Language + Default Contact)');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📝 Login Credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('User 1: rahul@example.com / password123');
    console.log('User 2: priya@example.com / password123');
    console.log('\n📊 Sample Data:');
    console.log('- 5 Plots (3 available, 1 booked, 1 pending)');
    console.log('- 9 House Designs (linked to plots: A-101: 2, A-102: 1, A-103: 2, B-201: 3, B-202: 1)');
    console.log('- 2 Sample Bookings');
    console.log('- 1 Owner Info (Deepak Kumar Singh)\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
