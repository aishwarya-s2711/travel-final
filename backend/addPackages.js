const mongoose = require('mongoose');
const Package = require('./model/Package');
require('dotenv').config();

const newPackages = [
  {
    title: 'Maldives Paradise Escape',
    destination: 'Maldives',
    country: 'Maldives',
    category: 'International',
    type: 'Luxury',
    price: 199920,
    duration: '5D/4N',
    durationDays: 5,
    durationNights: 4,
    coverImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Experience ultimate luxury in the pristine waters of the Maldives.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Bali Exotic Getaway',
    destination: 'Bali',
    country: 'Indonesia',
    category: 'International',
    type: 'Honeymoon',
    price: 151920,
    duration: '7D/6N',
    durationDays: 7,
    durationNights: 6,
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Discover the cultural and natural beauty of Bali with your loved one.',
    isFeatured: true,
    isBestSeller: false
  },
  {
    title: 'Swiss Alpine Adventure',
    destination: 'Swiss Alps',
    country: 'Switzerland',
    category: 'International',
    type: 'Adventure',
    price: 263920,
    duration: '8D/7N',
    durationDays: 8,
    durationNights: 7,
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Embark on an unforgettable adventure through the majestic Swiss Alps.',
    isFeatured: true,
    isBestSeller: false
  },
  {
    title: 'Dubai Luxury Retreat',
    destination: 'Dubai',
    country: 'UAE',
    category: 'International',
    type: 'Luxury',
    price: 127920,
    duration: '4D/3N',
    durationDays: 4,
    durationNights: 3,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Enjoy world-class shopping, dining, and futuristic architecture in Dubai.',
    isFeatured: false,
    isBestSeller: true
  },
  {
    title: 'Greek Island Hopper',
    destination: 'Santorini',
    country: 'Greece',
    category: 'International',
    type: 'Honeymoon',
    price: 231920,
    duration: '10D/9N',
    durationDays: 10,
    durationNights: 9,
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Explore the stunning white-washed villages and crystal clear waters of Greece.',
    isFeatured: true,
    isBestSeller: false
  },
  {
    title: 'Thailand Discovery Tour',
    destination: 'Bangkok',
    country: 'Thailand',
    category: 'International',
    type: 'Family',
    price: 103920,
    duration: '9D/8N',
    durationDays: 9,
    durationNights: 8,
    coverImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'A perfect family vacation exploring temples, beaches, and vibrant cities.',
    isFeatured: false,
    isBestSeller: true
  }
];

const dns = require('dns');
const nodeDefaultDNS = dns.getServers();
if (
  nodeDefaultDNS.length === 0 ||
  nodeDefaultDNS.every(s => s === '127.0.0.1' || s === '::1')
) {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
}

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    for (const pkg of newPackages) {
      const existing = await Package.findOne({ title: pkg.title });
      if (!existing) {
        const newPackage = new Package(pkg);
        await newPackage.save();
        console.log(`Inserted package: ${pkg.title}`);
      } else {
        console.log(`Package already exists: ${pkg.title}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};
seedDB();
