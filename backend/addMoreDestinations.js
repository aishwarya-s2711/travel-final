const mongoose = require('mongoose');
const Package = require('./model/Package');
require('dotenv').config();

const newPackages = [
  {
    title: 'Paris City of Love Tour',
    destination: 'Paris',
    country: 'France',
    category: 'International',
    type: 'Honeymoon',
    price: 180000,
    duration: '6D/5N',
    durationDays: 6,
    durationNights: 5,
    coverImage: 'https://images.unsplash.com/photo-1502602881472-87132f04ccf5?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Experience the romance, culture, and art of Paris.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Patagonia Wilderness Expedition',
    destination: 'Patagonia',
    country: 'Argentina',
    category: 'International',
    type: 'Adventure',
    price: 250000,
    duration: '10D/9N',
    durationDays: 10,
    durationNights: 9,
    coverImage: 'https://images.unsplash.com/photo-1502482329241-11d8820d8299?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Trek the breathtaking glaciers and mountains of Patagonia.',
    isFeatured: false,
    isBestSeller: false
  },
  {
    title: 'Tokyo Cultural Journey',
    destination: 'Tokyo',
    country: 'Japan',
    category: 'International',
    type: 'Family',
    price: 195000,
    duration: '7D/6N',
    durationDays: 7,
    durationNights: 6,
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Explore the neon lights, shrines, and culinary wonders of Tokyo.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Cairo Ancient Wonders',
    destination: 'Cairo',
    country: 'Egypt',
    category: 'International',
    type: 'Family',
    price: 110000,
    duration: '5D/4N',
    durationDays: 5,
    durationNights: 4,
    coverImage: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Discover the Great Pyramids and ancient history along the Nile.',
    isFeatured: false,
    isBestSeller: false
  },
  {
    title: 'Sydney Harbour Getaway',
    destination: 'Sydney',
    country: 'Australia',
    category: 'International',
    type: 'Family',
    price: 220000,
    duration: '8D/7N',
    durationDays: 8,
    durationNights: 7,
    coverImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Enjoy iconic landmarks, stunning beaches, and wildlife in Sydney.',
    isFeatured: true,
    isBestSeller: false
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
