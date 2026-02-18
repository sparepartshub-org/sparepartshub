/**
 * Database seeder — creates default admin, categories, and sample data
 * Run: npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'Engine Parts', slug: 'engine-parts', vehicleType: 'both', description: 'Pistons, gaskets, valves, timing belts and more' },
  { name: 'Brake System', slug: 'brake-system', vehicleType: 'both', description: 'Brake pads, rotors, calipers, brake fluid' },
  { name: 'Electrical', slug: 'electrical', vehicleType: 'both', description: 'Batteries, alternators, starters, spark plugs' },
  { name: 'Suspension', slug: 'suspension', vehicleType: 'both', description: 'Shock absorbers, struts, springs, bushings' },
  { name: 'Body Parts', slug: 'body-parts', vehicleType: 'both', description: 'Mirrors, bumpers, fenders, lights' },
  { name: 'Filters & Fluids', slug: 'filters-fluids', vehicleType: 'both', description: 'Oil filters, air filters, coolant, lubricants' },
  { name: 'Transmission', slug: 'transmission', vehicleType: 'both', description: 'Clutch plates, gear cables, bearings' },
  { name: 'Exhaust System', slug: 'exhaust-system', vehicleType: 'both', description: 'Silencers, catalytic converters, exhaust pipes' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@sparepartshub.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91-9999999999',
    });
    console.log('✅ Admin created: admin@sparepartshub.com / admin123');

    // Create sample wholesaler
    const wholesaler = await User.create({
      name: 'AutoParts Wholesale Co.',
      email: 'wholesaler@sparepartshub.com',
      password: 'wholesaler123',
      role: 'wholesaler',
      businessName: 'AutoParts Wholesale Co.',
      businessLicense: 'WH-2024-001',
      isApproved: true,
      phone: '+91-8888888888',
    });
    console.log('✅ Wholesaler created: wholesaler@sparepartshub.com / wholesaler123');

    // Create sample customer
    await User.create({
      name: 'John Customer',
      email: 'customer@sparepartshub.com',
      password: 'customer123',
      role: 'customer',
      phone: '+91-7777777777',
      address: { street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' },
    });
    console.log('✅ Customer created: customer@sparepartshub.com / customer123');

    // Create categories
    const cats = await Category.insertMany(categories);
    console.log(`✅ ${cats.length} categories created`);

    // Create sample products
    const sampleProducts = [
      { name: 'Honda CBR Brake Pads (Front)', description: 'High-performance front brake pads for Honda CBR series. Excellent stopping power and long-lasting.', price: 850, comparePrice: 1200, category: cats[1]._id, brand: 'Brembo', vehicleType: 'bike', vehicleMake: 'Honda', vehicleModel: 'CBR', stock: 50, tags: ['brake', 'honda', 'cbr'] },
      { name: 'Toyota Innova Air Filter', description: 'Premium quality air filter for Toyota Innova. Ensures clean air intake for optimal engine performance.', price: 450, comparePrice: 650, category: cats[5]._id, brand: 'Mann Filter', vehicleType: 'car', vehicleMake: 'Toyota', vehicleModel: 'Innova', stock: 100, tags: ['filter', 'toyota', 'innova'] },
      { name: 'Royal Enfield Classic Clutch Plate', description: 'Genuine clutch plate for Royal Enfield Classic 350/500. Smooth engagement and durable.', price: 1200, comparePrice: 1800, category: cats[6]._id, brand: 'Royal Enfield', vehicleType: 'bike', vehicleMake: 'Royal Enfield', vehicleModel: 'Classic 350', stock: 30, tags: ['clutch', 'royal enfield'] },
      { name: 'Maruti Suzuki Swift Headlight Assembly', description: 'Complete headlight assembly for Maruti Suzuki Swift. Crystal clear lens with H4 bulb compatibility.', price: 3500, comparePrice: 5000, category: cats[4]._id, brand: 'Lumax', vehicleType: 'car', vehicleMake: 'Maruti Suzuki', vehicleModel: 'Swift', stock: 20, tags: ['headlight', 'swift', 'maruti'] },
      { name: 'Bajaj Pulsar Spark Plug Set', description: 'NGK iridium spark plug for Bajaj Pulsar. Better ignition, improved fuel efficiency.', price: 350, comparePrice: 500, category: cats[2]._id, brand: 'NGK', vehicleType: 'bike', vehicleMake: 'Bajaj', vehicleModel: 'Pulsar', stock: 200, tags: ['spark plug', 'bajaj', 'pulsar'] },
      { name: 'Hyundai Creta Shock Absorber (Front)', description: 'KYB front shock absorber for Hyundai Creta. Superior ride comfort and stability.', price: 4200, comparePrice: 6000, category: cats[3]._id, brand: 'KYB', vehicleType: 'car', vehicleMake: 'Hyundai', vehicleModel: 'Creta', stock: 15, tags: ['shock absorber', 'hyundai', 'creta'] },
      { name: 'Yamaha R15 Chain Sprocket Kit', description: 'Complete chain and sprocket kit for Yamaha R15. DID chain with hardened sprockets.', price: 1800, comparePrice: 2500, category: cats[0]._id, brand: 'DID', vehicleType: 'bike', vehicleMake: 'Yamaha', vehicleModel: 'R15', stock: 40, tags: ['chain', 'sprocket', 'yamaha'] },
      { name: 'Honda City Engine Oil 5W-30 (4L)', description: 'Castrol EDGE 5W-30 fully synthetic engine oil. 4-litre pack for Honda City.', price: 2800, comparePrice: 3200, category: cats[5]._id, brand: 'Castrol', vehicleType: 'car', vehicleMake: 'Honda', vehicleModel: 'City', stock: 75, tags: ['oil', 'castrol', 'honda'] },
    ];

    const products = sampleProducts.map(p => ({
      ...p,
      wholesaler: wholesaler._id,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36),
      images: [],
    }));
    await Product.insertMany(products);
    console.log(`✅ ${products.length} sample products created`);

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
