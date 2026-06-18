const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env variables
dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB for seeding...');

    // Clear all existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // --- Create Users ---
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shopez.com',
      password: 'Admin@123',
      role: 'admin',
    });

    const seller = await User.create({
      name: 'ShopEZ Store',
      email: 'seller@shopez.com',
      password: 'Seller@123',
      role: 'seller',
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'user@shopez.com',
      password: 'User@123',
      role: 'user',
    });

    console.log('👤 Created users: admin, seller, user');

    // --- Create Categories ---
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        description: 'Laptops, phones, gadgets and electronic accessories',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      },
      {
        name: 'Fashion',
        description: 'Clothing, shoes, and fashion accessories for all',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      },
      {
        name: 'Home & Kitchen',
        description: 'Furniture, kitchen appliances, and home decor',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      },
      {
        name: 'Books',
        description: 'Fiction, non-fiction, academic, and self-help books',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      },
      {
        name: 'Sports & Fitness',
        description: 'Sports equipment, gym gear, and fitness accessories',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      },
      {
        name: 'Beauty & Personal Care',
        description: 'Skincare, makeup, grooming, and wellness products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      },
    ]);

    console.log('📂 Created 6 categories');

    // Helper to get category ID by name
    const getCatId = (name) => categories.find((c) => c.name === name)._id;

    // --- Create Products ---
    const products = await Product.insertMany([
      // Electronics (4 products)
      {
        name: 'Wireless Bluetooth Headphones Pro',
        description: 'Premium noise-canceling wireless headphones with 40-hour battery life, deep bass, and ultra-comfortable design. Perfect for music lovers and professionals. Features ANC technology, Bluetooth 5.3, and foldable design.',
        price: 149.99,
        discountPrice: 119.99,
        category: getCatId('Electronics'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
        stock: 50,
        ratings: 4.5,
        numReviews: 12,
        featured: true,
      },
      {
        name: 'Ultra-Slim Laptop 15.6" Intel i7',
        description: 'Powerful ultra-slim laptop with 15.6" Full HD display, Intel Core i7 processor, 16GB RAM, 512GB SSD. Ideal for work and entertainment with all-day battery life.',
        price: 899.99,
        discountPrice: 799.99,
        category: getCatId('Electronics'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'],
        stock: 25,
        ratings: 4.7,
        numReviews: 8,
        featured: true,
      },
      {
        name: 'Smart Watch Series X',
        description: 'Advanced smartwatch with health monitoring, GPS tracking, water resistance up to 50m, and 7-day battery life. Compatible with iOS and Android.',
        price: 299.99,
        discountPrice: 249.99,
        category: getCatId('Electronics'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
        stock: 75,
        ratings: 4.3,
        numReviews: 15,
        featured: true,
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Compact waterproof Bluetooth speaker with 360° surround sound, 20-hour playtime, and built-in microphone. Perfect for outdoor adventures.',
        price: 59.99,
        category: getCatId('Electronics'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
        stock: 100,
        ratings: 4.1,
        numReviews: 20,
      },

      // Fashion (4 products)
      {
        name: 'Classic Leather Jacket - Men',
        description: 'Genuine leather jacket with a timeless design. Features soft inner lining, multiple pockets, and premium zipper hardware. Available in Black and Brown.',
        price: 199.99,
        discountPrice: 159.99,
        category: getCatId('Fashion'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
        stock: 30,
        ratings: 4.6,
        numReviews: 10,
        featured: true,
      },
      {
        name: 'Running Sneakers - Unisex',
        description: 'Lightweight and breathable running shoes with advanced cushioning technology. Designed for maximum comfort during long runs and workouts.',
        price: 89.99,
        discountPrice: 69.99,
        category: getCatId('Fashion'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
        stock: 60,
        ratings: 4.4,
        numReviews: 18,
        featured: true,
      },
      {
        name: 'Designer Sunglasses UV400',
        description: 'Stylish polarized sunglasses with UV400 protection. Durable metal frame with anti-glare lenses. Perfect for driving and outdoor activities.',
        price: 49.99,
        category: getCatId('Fashion'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'],
        stock: 80,
        ratings: 4.2,
        numReviews: 14,
      },
      {
        name: 'Premium Cotton T-Shirt Pack',
        description: 'Pack of 3 premium 100% cotton t-shirts. Soft, comfortable, and durable. Available in multiple color combinations. Machine washable.',
        price: 39.99,
        category: getCatId('Fashion'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
        stock: 120,
        ratings: 4.0,
        numReviews: 25,
      },

      // Home & Kitchen (4 products)
      {
        name: 'Automatic Espresso Coffee Machine',
        description: 'Professional-grade espresso machine with built-in grinder, milk frother, and 15-bar pressure system. Makes perfect espresso, cappuccino, and latte every time.',
        price: 349.99,
        discountPrice: 299.99,
        category: getCatId('Home & Kitchen'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600'],
        stock: 15,
        ratings: 4.8,
        numReviews: 6,
        featured: true,
      },
      {
        name: 'Air Purifier with HEPA Filter',
        description: 'Advanced air purifier with True HEPA filter, removes 99.97% of allergens, dust, and pollutants. Smart air quality sensor with auto mode. Covers up to 500 sq ft.',
        price: 179.99,
        category: getCatId('Home & Kitchen'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600'],
        stock: 35,
        ratings: 4.5,
        numReviews: 9,
      },
      {
        name: 'Non-Stick Cookware Set (10-Piece)',
        description: 'Complete non-stick cookware set including frying pans, saucepans, and stockpot. PFOA-free coating, dishwasher safe, and suitable for all cooktops.',
        price: 129.99,
        discountPrice: 99.99,
        category: getCatId('Home & Kitchen'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600'],
        stock: 40,
        ratings: 4.3,
        numReviews: 11,
      },
      {
        name: 'Smart LED Desk Lamp',
        description: 'Modern LED desk lamp with adjustable brightness, color temperature control, USB charging port, and touch controls. Eye-care technology reduces eye strain.',
        price: 45.99,
        category: getCatId('Home & Kitchen'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'],
        stock: 90,
        ratings: 4.1,
        numReviews: 7,
      },

      // Books (4 products)
      {
        name: 'The Art of Programming - Complete Edition',
        description: 'Comprehensive guide to computer programming covering algorithms, data structures, and software design patterns. 850+ pages with practical examples.',
        price: 49.99,
        discountPrice: 39.99,
        category: getCatId('Books'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
        stock: 200,
        ratings: 4.9,
        numReviews: 30,
        featured: true,
      },
      {
        name: 'Mindset: The New Psychology of Success',
        description: 'Bestselling self-help book exploring how our mindset shapes our lives. Learn the difference between fixed and growth mindsets and transform your approach to challenges.',
        price: 19.99,
        category: getCatId('Books'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
        stock: 150,
        ratings: 4.6,
        numReviews: 22,
      },
      {
        name: 'World Atlas - Illustrated Edition',
        description: 'Beautiful hardcover illustrated world atlas with detailed maps, geographic data, and stunning photography. Perfect reference for students and geography enthusiasts.',
        price: 34.99,
        category: getCatId('Books'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600'],
        stock: 45,
        ratings: 4.4,
        numReviews: 5,
      },

      // Sports & Fitness (3 products)
      {
        name: 'Adjustable Dumbbell Set (5-50 lbs)',
        description: 'Space-saving adjustable dumbbells that replace 15 sets of weights. Quick-change weight selection mechanism. Perfect for home gym workouts.',
        price: 299.99,
        discountPrice: 249.99,
        category: getCatId('Sports & Fitness'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'],
        stock: 20,
        ratings: 4.7,
        numReviews: 13,
      },
      {
        name: 'Premium Yoga Mat with Bag',
        description: 'Extra thick 6mm yoga mat with non-slip surface, alignment lines, and carrying bag. Made from eco-friendly TPE material. Perfect for yoga, pilates, and stretching.',
        price: 39.99,
        category: getCatId('Sports & Fitness'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'],
        stock: 70,
        ratings: 4.3,
        numReviews: 16,
      },
      {
        name: 'Fitness Tracker Band Pro',
        description: 'Advanced fitness tracker with heart rate monitoring, sleep tracking, step counter, and 14-day battery life. Water resistant and smartphone notifications.',
        price: 79.99,
        discountPrice: 59.99,
        category: getCatId('Sports & Fitness'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600'],
        stock: 55,
        ratings: 4.2,
        numReviews: 19,
      },

      // Beauty & Personal Care (3 products)
      {
        name: 'Organic Skincare Essentials Kit',
        description: 'Complete organic skincare set including cleanser, toner, moisturizer, and serum. Made with natural ingredients, suitable for all skin types. Cruelty-free and paraben-free.',
        price: 79.99,
        discountPrice: 64.99,
        category: getCatId('Beauty & Personal Care'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'],
        stock: 45,
        ratings: 4.5,
        numReviews: 17,
      },
      {
        name: 'Professional Hair Dryer 2200W',
        description: 'Salon-grade hair dryer with ionic technology, 3 heat settings, 2 speed settings, and cool shot button. Includes diffuser and concentrator attachments.',
        price: 69.99,
        category: getCatId('Beauty & Personal Care'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?w=600'],
        stock: 40,
        ratings: 4.4,
        numReviews: 8,
      },
      {
        name: 'Luxury Perfume Collection Mini Set',
        description: 'Gift set of 5 miniature luxury perfumes featuring floral, woody, and citrus fragrances. Perfect for discovering your signature scent.',
        price: 54.99,
        category: getCatId('Beauty & Personal Care'),
        seller: seller._id,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'],
        stock: 60,
        ratings: 4.6,
        numReviews: 12,
      },
    ]);

    console.log(`🛍️  Created ${products.length} sample products`);

    // --- Create Sample Reviews ---
    const sampleReviews = [
      {
        user: user._id,
        product: products[0]._id,
        rating: 5,
        comment: 'Amazing headphones! The noise cancellation is top-notch and battery life is incredible.',
      },
      {
        user: user._id,
        product: products[1]._id,
        rating: 4,
        comment: 'Great laptop for the price. Fast performance and beautiful display. Would recommend.',
      },
      {
        user: user._id,
        product: products[4]._id,
        rating: 5,
        comment: 'Best leather jacket I have ever owned. The quality is outstanding!',
      },
    ];

    await Review.insertMany(sampleReviews);
    console.log('⭐ Created sample reviews');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('  Admin  → admin@shopez.com / Admin@123');
    console.log('  Seller → seller@shopez.com / Seller@123');
    console.log('  User   → user@shopez.com / User@123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
