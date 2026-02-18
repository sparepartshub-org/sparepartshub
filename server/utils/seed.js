/**
 * Database seeder — creates default admin, categories, and sample data
 * Run: npm run seed
 *
 * NOTE: This will clear ALL existing data. Run with care.
 * All data is India-specific: INR prices, Indian brands, Indian addresses.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const categories = [
  // Universal categories
  { name: 'Engine Parts', slug: 'engine-parts', vehicleType: 'both', description: 'Pistons, gaskets, valves, timing belts and more' },
  { name: 'Brake System', slug: 'brake-system', vehicleType: 'both', description: 'Brake pads, rotors, calipers, brake fluid' },
  { name: 'Electrical', slug: 'electrical', vehicleType: 'both', description: 'Batteries, alternators, starters, spark plugs' },
  { name: 'Suspension', slug: 'suspension', vehicleType: 'both', description: 'Shock absorbers, struts, springs, bushings' },
  { name: 'Body Parts', slug: 'body-parts', vehicleType: 'both', description: 'Mirrors, bumpers, fenders, lights' },
  { name: 'Filters & Fluids', slug: 'filters-fluids', vehicleType: 'both', description: 'Oil filters, air filters, coolant, lubricants' },
  { name: 'Transmission', slug: 'transmission', vehicleType: 'both', description: 'Clutch plates, gear cables, bearings' },
  { name: 'Exhaust System', slug: 'exhaust-system', vehicleType: 'both', description: 'Silencers, catalytic converters, exhaust pipes' },
  // Tractor-specific categories
  { name: 'Tractor Hydraulics', slug: 'tractor-hydraulics', vehicleType: 'tractor', description: 'Hydraulic pumps, cylinders, hoses, valves for tractors' },
  { name: 'Tractor PTO & Implements', slug: 'tractor-pto-implements', vehicleType: 'tractor', description: 'PTO shafts, couplings, implement parts' },
  { name: 'Tractor Steering', slug: 'tractor-steering', vehicleType: 'tractor', description: 'Power steering pumps, steering columns, tie rods' },
  { name: 'Tractor Tyres & Wheels', slug: 'tractor-tyres-wheels', vehicleType: 'tractor', description: 'Front & rear tractor tyres, rims, tubes' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Order.deleteMany()]);

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@sparepartshub.com',
      password: 'admin123',
      role: 'admin',
      phone: '+919999999999',
      address: {
        street: '42, MG Road, Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110001',
        country: 'India',
      },
    });
    console.log('✅ Admin created: admin@sparepartshub.com / admin123');

    // Create sample wholesalers (dealers) across India
    const dealer1 = await User.create({
      name: 'Sharma Auto Parts',
      email: 'wholesaler@sparepartshub.com',
      password: 'wholesaler123',
      role: 'wholesaler',
      businessName: 'Sharma Auto Parts & Accessories',
      businessLicense: 'MH-DL-2024-001',
      isApproved: true,
      phone: '+918888888888',
      whatsappNumber: '+918888888888',
      address: {
        street: '15, Kashmere Gate Auto Market',
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '110006',
        country: 'India',
      },
    });

    const dealer2 = await User.create({
      name: 'Patel Motors Spares',
      email: 'dealer2@sparepartshub.com',
      password: 'dealer123',
      role: 'wholesaler',
      businessName: 'Patel Motors Spares Pvt Ltd',
      businessLicense: 'GJ-DL-2024-002',
      isApproved: true,
      phone: '+917777777777',
      whatsappNumber: '+917777777777',
      address: {
        street: '88, GIDC Industrial Estate, Vatva',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pinCode: '382445',
        country: 'India',
      },
    });

    const dealer3 = await User.create({
      name: 'Reddy Tractor Parts',
      email: 'dealer3@sparepartshub.com',
      password: 'dealer123',
      role: 'wholesaler',
      businessName: 'Reddy Tractor & Agri Parts',
      businessLicense: 'TS-DL-2024-003',
      isApproved: true,
      phone: '+916666666666',
      whatsappNumber: '+916666666666',
      address: {
        street: '23, Begumpet Industrial Area',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500016',
        country: 'India',
      },
    });

    console.log('✅ Dealers created: wholesaler@sparepartshub.com / wholesaler123');
    console.log('✅ Dealers created: dealer2@sparepartshub.com / dealer123');
    console.log('✅ Dealers created: dealer3@sparepartshub.com / dealer123');

    // Create sample customers
    await User.create({
      name: 'Amit Kumar',
      email: 'customer@sparepartshub.com',
      password: 'customer123',
      role: 'customer',
      phone: '+917777777770',
      address: { street: '45, Sector 15, Koregaon Park', city: 'Pune', state: 'Maharashtra', pinCode: '411001', country: 'India' },
    });

    await User.create({
      name: 'Priya Nair',
      email: 'customer2@sparepartshub.com',
      password: 'customer123',
      role: 'customer',
      phone: '+919876543210',
      address: { street: '12, Anna Nagar East', city: 'Chennai', state: 'Tamil Nadu', pinCode: '600040', country: 'India' },
    });

    await User.create({
      name: 'Gurpreet Singh',
      email: 'customer3@sparepartshub.com',
      password: 'customer123',
      role: 'customer',
      phone: '+918765432109',
      address: { street: '78, Model Town', city: 'Ludhiana', state: 'Punjab', pinCode: '141002', country: 'India' },
    });

    console.log('✅ Customers created: customer@sparepartshub.com / customer123');

    // Create categories
    const cats = await Category.insertMany(categories);
    console.log(`✅ ${cats.length} categories created (including tractor categories)`);

    // Create sample products — India-specific brands, prices in INR, dealer locations
    const sampleProducts = [
      // ─── Bike Parts ───
      {
        name: 'Hero Splendor Brake Shoe Set',
        description: 'Genuine brake shoe set for Hero Splendor Plus/iSmart. Long-lasting friction material for reliable stopping power. Fits all Splendor variants 2015-2024.',
        price: 299, comparePrice: 450, category: cats[1]._id, brand: 'Hero Genuine', vehicleType: 'bike',
        vehicleMake: 'Hero', vehicleModel: 'Splendor Plus', stock: 150, tags: ['brake', 'hero', 'splendor', 'shoe'],
        dealerState: 'Delhi', dealerCity: 'Delhi', wholesaler: dealer1._id,
      },
      {
        name: 'Royal Enfield Classic 350 Clutch Plate',
        description: 'OEM clutch plate for Royal Enfield Classic 350. Smooth engagement, long life. Compatible with UCE and J-series engines.',
        price: 1199, comparePrice: 1800, category: cats[6]._id, brand: 'Royal Enfield', vehicleType: 'bike',
        vehicleMake: 'Royal Enfield', vehicleModel: 'Classic 350', stock: 45, tags: ['clutch', 'royal enfield', 'classic'],
        dealerState: 'Tamil Nadu', dealerCity: 'Chennai', wholesaler: dealer2._id,
      },
      {
        name: 'Bajaj Pulsar NS200 Spark Plug (NGK Iridium)',
        description: 'NGK Iridium IX spark plug for Bajaj Pulsar NS200/RS200. Better ignition, improved fuel efficiency, 40,000 km life.',
        price: 449, comparePrice: 650, category: cats[2]._id, brand: 'NGK', vehicleType: 'bike',
        vehicleMake: 'Bajaj', vehicleModel: 'Pulsar NS200', stock: 200, tags: ['spark plug', 'bajaj', 'pulsar', 'ngk'],
        dealerState: 'Maharashtra', dealerCity: 'Pune', wholesaler: dealer1._id,
      },
      {
        name: 'TVS Apache RTR 160 Chain Sprocket Kit',
        description: 'Complete chain sprocket kit for TVS Apache RTR 160 4V. Includes DID chain + front & rear sprockets. Hardened teeth for long life.',
        price: 1599, comparePrice: 2200, category: cats[0]._id, brand: 'DID', vehicleType: 'bike',
        vehicleMake: 'TVS', vehicleModel: 'Apache RTR 160', stock: 60, tags: ['chain', 'sprocket', 'tvs', 'apache'],
        dealerState: 'Karnataka', dealerCity: 'Bangalore', wholesaler: dealer2._id,
      },
      {
        name: 'Honda Activa 6G Air Filter',
        description: 'Genuine air filter element for Honda Activa 6G / 125. Ensures clean air intake for optimal mileage and engine protection.',
        price: 199, comparePrice: 320, category: cats[5]._id, brand: 'Honda Genuine', vehicleType: 'bike',
        vehicleMake: 'Honda', vehicleModel: 'Activa 6G', stock: 300, tags: ['filter', 'honda', 'activa', 'air filter'],
        dealerState: 'Gujarat', dealerCity: 'Ahmedabad', wholesaler: dealer2._id,
      },
      {
        name: 'KTM Duke 200 Headlight Assembly',
        description: 'Aftermarket LED headlight assembly for KTM Duke 200/250. Bright white output, plug & play, IP67 waterproof.',
        price: 2499, comparePrice: 3800, category: cats[4]._id, brand: 'Osram', vehicleType: 'bike',
        vehicleMake: 'KTM', vehicleModel: 'Duke 200', stock: 25, tags: ['headlight', 'ktm', 'duke', 'led'],
        dealerState: 'Maharashtra', dealerCity: 'Mumbai', wholesaler: dealer1._id,
      },
      {
        name: 'Yamaha FZ-S V3 Rear Shock Absorber',
        description: 'Gas-charged rear mono-shock absorber for Yamaha FZ-S V3 / FZS-Fi. Adjustable preload, superior ride quality.',
        price: 1899, comparePrice: 2800, category: cats[3]._id, brand: 'Gabriel', vehicleType: 'bike',
        vehicleMake: 'Yamaha', vehicleModel: 'FZ-S V3', stock: 35, tags: ['shock', 'yamaha', 'fz', 'suspension'],
        dealerState: 'Delhi', dealerCity: 'Delhi', wholesaler: dealer1._id,
      },

      // ─── Car Parts ───
      {
        name: 'Maruti Suzuki Alto 800 Brake Pad Set (Front)',
        description: 'Premium front brake pad set for Maruti Suzuki Alto 800/K10. Ceramic compound for low dust and noise. Includes wear indicator.',
        price: 599, comparePrice: 900, category: cats[1]._id, brand: 'Bosch', vehicleType: 'car',
        vehicleMake: 'Maruti Suzuki', vehicleModel: 'Alto 800', stock: 120, tags: ['brake pad', 'maruti', 'alto', 'bosch'],
        dealerState: 'Delhi', dealerCity: 'Delhi', wholesaler: dealer1._id,
      },
      {
        name: 'Tata Nexon Engine Oil Filter',
        description: 'Genuine engine oil filter for Tata Nexon (Petrol & Diesel). Traps 99% contaminants. Change every 10,000 km.',
        price: 349, comparePrice: 550, category: cats[5]._id, brand: 'Tata Genuine', vehicleType: 'car',
        vehicleMake: 'Tata Motors', vehicleModel: 'Nexon', stock: 90, tags: ['oil filter', 'tata', 'nexon'],
        dealerState: 'Maharashtra', dealerCity: 'Pune', wholesaler: dealer1._id,
      },
      {
        name: 'Hyundai Creta Front Shock Absorber',
        description: 'KYB Excel-G front shock absorber for Hyundai Creta 2020+. Twin-tube gas technology for superior ride comfort and handling.',
        price: 3999, comparePrice: 5800, category: cats[3]._id, brand: 'KYB', vehicleType: 'car',
        vehicleMake: 'Hyundai', vehicleModel: 'Creta', stock: 18, tags: ['shock absorber', 'hyundai', 'creta', 'kyb'],
        dealerState: 'Tamil Nadu', dealerCity: 'Chennai', wholesaler: dealer2._id,
      },
      {
        name: 'Maruti Suzuki Swift Headlight Assembly (Left)',
        description: 'Complete left headlight assembly for Maruti Swift 2018-2024. Crystal clear lens, H4 bulb compatible. OEM quality replacement.',
        price: 3299, comparePrice: 4800, category: cats[4]._id, brand: 'Lumax', vehicleType: 'car',
        vehicleMake: 'Maruti Suzuki', vehicleModel: 'Swift', stock: 22, tags: ['headlight', 'swift', 'maruti', 'lumax'],
        dealerState: 'Gujarat', dealerCity: 'Ahmedabad', wholesaler: dealer2._id,
      },
      {
        name: 'Toyota Innova Crysta Air Filter',
        description: 'Premium air filter for Toyota Innova Crysta (Diesel). Mann+Hummel technology. Ensures clean air for optimal engine performance.',
        price: 549, comparePrice: 800, category: cats[5]._id, brand: 'Mann Filter', vehicleType: 'car',
        vehicleMake: 'Toyota', vehicleModel: 'Innova Crysta', stock: 85, tags: ['air filter', 'toyota', 'innova'],
        dealerState: 'Karnataka', dealerCity: 'Bangalore', wholesaler: dealer2._id,
      },
      {
        name: 'Honda City 5W-30 Engine Oil (4L)',
        description: 'Castrol EDGE 5W-30 fully synthetic engine oil. 4-litre pack. Recommended for Honda City, Amaze, Jazz. Superior protection.',
        price: 2799, comparePrice: 3400, category: cats[5]._id, brand: 'Castrol', vehicleType: 'car',
        vehicleMake: 'Honda', vehicleModel: 'City', stock: 65, tags: ['engine oil', 'castrol', 'honda', 'city'],
        dealerState: 'Maharashtra', dealerCity: 'Mumbai', wholesaler: dealer1._id,
      },
      {
        name: 'Mahindra XUV700 Cabin Air Filter',
        description: 'Activated carbon cabin air filter for Mahindra XUV700. Filters dust, pollen, and odors for fresh cabin air.',
        price: 699, comparePrice: 1100, category: cats[5]._id, brand: 'Mahindra Genuine', vehicleType: 'car',
        vehicleMake: 'Mahindra', vehicleModel: 'XUV700', stock: 55, tags: ['cabin filter', 'mahindra', 'xuv700'],
        dealerState: 'Telangana', dealerCity: 'Hyderabad', wholesaler: dealer3._id,
      },

      // ─── Tractor Parts ───
      {
        name: 'Mahindra 575 DI Hydraulic Pump',
        description: 'Heavy-duty hydraulic pump for Mahindra 575 DI tractor. Ensures smooth hydraulic lift operation for implements. Made in India.',
        price: 8499, comparePrice: 12000, category: cats[8]._id, brand: 'Mahindra Genuine', vehicleType: 'tractor',
        vehicleMake: 'Mahindra', vehicleModel: '575 DI', stock: 12, tags: ['hydraulic', 'mahindra', 'tractor', 'pump'],
        dealerState: 'Punjab', dealerCity: 'Ludhiana', wholesaler: dealer3._id,
      },
      {
        name: 'Swaraj 744 FE Air Filter',
        description: 'Premium air filter for Swaraj 744 FE tractor. Keeps engine clean and efficient in dusty Indian farm conditions.',
        price: 649, comparePrice: 950, category: cats[5]._id, brand: 'Swaraj Genuine', vehicleType: 'tractor',
        vehicleMake: 'Swaraj', vehicleModel: '744 FE', stock: 70, tags: ['filter', 'swaraj', 'tractor'],
        dealerState: 'Punjab', dealerCity: 'Mohali', wholesaler: dealer3._id,
      },
      {
        name: 'John Deere 5310 PTO Shaft Assembly',
        description: 'Genuine PTO shaft assembly for John Deere 5310 tractor. High-strength steel for heavy implement usage. 540 RPM standard.',
        price: 5199, comparePrice: 7500, category: cats[9]._id, brand: 'John Deere', vehicleType: 'tractor',
        vehicleMake: 'John Deere', vehicleModel: '5310', stock: 10, tags: ['pto', 'john deere', 'tractor', 'shaft'],
        dealerState: 'Rajasthan', dealerCity: 'Jaipur', wholesaler: dealer3._id,
      },
      {
        name: 'Sonalika DI 750 III Power Steering Pump',
        description: 'Power steering pump for Sonalika DI 750 III tractor. Makes steering effortless during field and road work.',
        price: 6799, comparePrice: 9500, category: cats[10]._id, brand: 'Sonalika', vehicleType: 'tractor',
        vehicleMake: 'Sonalika', vehicleModel: 'DI 750 III', stock: 14, tags: ['steering', 'sonalika', 'tractor', 'pump'],
        dealerState: 'Haryana', dealerCity: 'Karnal', wholesaler: dealer3._id,
      },
      {
        name: 'TAFE Massey Ferguson 1035 Clutch Plate',
        description: 'Heavy-duty clutch plate for TAFE Massey Ferguson 1035 DI tractor. Long-lasting, reliable performance for Indian farms.',
        price: 3199, comparePrice: 4500, category: cats[6]._id, brand: 'TAFE', vehicleType: 'tractor',
        vehicleMake: 'TAFE', vehicleModel: 'MF 1035 DI', stock: 25, tags: ['clutch', 'massey', 'tafe', 'tractor'],
        dealerState: 'Madhya Pradesh', dealerCity: 'Bhopal', wholesaler: dealer3._id,
      },
      {
        name: 'Escorts Farmtrac 60 Rear Tyre (14.9-28)',
        description: 'Heavy-duty rear tyre for Escorts Farmtrac 60 tractor. Superior grip in wet and dry Indian farm conditions. CEAT brand.',
        price: 11999, comparePrice: 16000, category: cats[11]._id, brand: 'CEAT', vehicleType: 'tractor',
        vehicleMake: 'Escorts', vehicleModel: 'Farmtrac 60', stock: 8, tags: ['tyre', 'escorts', 'farmtrac', 'tractor', 'ceat'],
        dealerState: 'Uttar Pradesh', dealerCity: 'Lucknow', wholesaler: dealer3._id,
      },
      {
        name: 'Mahindra Arjun 605 DI Radiator Assembly',
        description: 'Complete radiator assembly for Mahindra Arjun 605 DI tractor. All-aluminium core for efficient cooling in Indian summers.',
        price: 4999, comparePrice: 7200, category: cats[0]._id, brand: 'Mahindra Genuine', vehicleType: 'tractor',
        vehicleMake: 'Mahindra', vehicleModel: 'Arjun 605 DI', stock: 9, tags: ['radiator', 'mahindra', 'arjun', 'tractor'],
        dealerState: 'Telangana', dealerCity: 'Hyderabad', wholesaler: dealer3._id,
      },
    ];

    const products = sampleProducts.map(p => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36),
      images: [],
    }));
    await Product.insertMany(products);
    console.log(`✅ ${products.length} sample products created (bikes, cars, tractors)`);

    // Create sample orders with Indian delivery routes
    const customer1 = await User.findOne({ email: 'customer@sparepartshub.com' });
    const productDocs = await Product.find().limit(3);

    if (customer1 && productDocs.length >= 3) {
      const order1 = await Order.create({
        orderNumber: 'SPH-260218-ABC01',
        customer: customer1._id,
        items: [
          {
            product: productDocs[0]._id,
            name: productDocs[0].name,
            price: productDocs[0].price,
            quantity: 2,
            wholesaler: productDocs[0].wholesaler,
            image: '',
          },
        ],
        shippingAddress: {
          street: '45, Sector 15, Koregaon Park',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411001',
          country: 'India',
        },
        paymentMethod: 'cod',
        itemsTotal: productDocs[0].price * 2,
        shippingCost: 99,
        tax: Math.round(productDocs[0].price * 2 * 0.18),
        totalAmount: productDocs[0].price * 2 + 99 + Math.round(productDocs[0].price * 2 * 0.18),
        status: 'shipped',
        statusHistory: [
          { status: 'placed', note: 'Order placed from Pune, Maharashtra', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { status: 'confirmed', note: 'Confirmed by Sharma Auto Parts, Delhi', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
          { status: 'packed', note: 'Packed at Delhi warehouse', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { status: 'shipped', note: 'Shipped via DTDC — Delhi → Pune route', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        ],
        tracking: [
          { status: 'placed', description: 'Order placed successfully from Pune', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { status: 'confirmed', description: 'Order confirmed by dealer in Delhi', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
          { status: 'packed', description: 'Order packed at Kashmere Gate Auto Market, Delhi', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { status: 'shipped', description: 'Shipped from Delhi — via Jaipur, arriving Pune in 2-3 days', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        ],
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        trackingNumber: 'DTDC-IN-784521369',
      });

      await Order.create({
        orderNumber: 'SPH-260218-XYZ02',
        customer: customer1._id,
        items: [
          {
            product: productDocs[1]._id,
            name: productDocs[1].name,
            price: productDocs[1].price,
            quantity: 1,
            wholesaler: productDocs[1].wholesaler,
            image: '',
          },
          {
            product: productDocs[2]._id,
            name: productDocs[2].name,
            price: productDocs[2].price,
            quantity: 3,
            wholesaler: productDocs[2].wholesaler,
            image: '',
          },
        ],
        shippingAddress: {
          street: '45, Sector 15, Koregaon Park',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411001',
          country: 'India',
        },
        paymentMethod: 'cod',
        itemsTotal: productDocs[1].price + productDocs[2].price * 3,
        shippingCost: 0,
        tax: Math.round((productDocs[1].price + productDocs[2].price * 3) * 0.18),
        totalAmount: productDocs[1].price + productDocs[2].price * 3 + Math.round((productDocs[1].price + productDocs[2].price * 3) * 0.18),
        status: 'delivered',
        statusHistory: [
          { status: 'placed', note: 'Order placed from Pune', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
          { status: 'confirmed', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
          { status: 'packed', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
          { status: 'shipped', note: 'Shipped via Delhivery — Ahmedabad → Pune', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { status: 'out_for_delivery', note: 'Out for delivery in Pune', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { status: 'delivered', note: 'Delivered at Koregaon Park, Pune', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        ],
        tracking: [
          { status: 'placed', description: 'Order placed', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
          { status: 'confirmed', description: 'Confirmed by Patel Motors, Ahmedabad', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
          { status: 'packed', description: 'Packed at GIDC Vatva, Ahmedabad', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
          { status: 'shipped', description: 'Shipped Ahmedabad → Pune via Delhivery', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { status: 'out_for_delivery', description: 'Out for delivery in Koregaon Park area, Pune', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { status: 'delivered', description: 'Delivered successfully — signed by Amit Kumar', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        ],
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      });

      console.log('✅ 2 sample orders created with Indian delivery routes');
    }

    console.log('\n🎉 Seed complete! 🇮🇳');
    console.log('📋 Categories include tractor-specific: Hydraulics, PTO & Implements, Steering, Tyres & Wheels');
    console.log('🏍️ Bike brands: Hero, Royal Enfield, Bajaj, TVS, Honda, KTM, Yamaha');
    console.log('🚗 Car brands: Maruti Suzuki, Tata Motors, Hyundai, Toyota, Honda, Mahindra');
    console.log('🚜 Tractor brands: Mahindra, Swaraj, John Deere, Sonalika, TAFE, Escorts');
    console.log('💰 All prices in Indian Rupees (₹)');
    console.log('📍 Dealer locations across India: Delhi, Mumbai, Pune, Ahmedabad, Chennai, Bangalore, Hyderabad, Ludhiana');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
