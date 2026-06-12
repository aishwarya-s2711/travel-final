const mongoose = require('mongoose');
const Package = require('./model/Package');

require('dotenv').config();

const packagesToInsert = [
  {
    title: 'Goa Beach Paradise',
    destination: 'Goa',
    country: 'India',
    category: 'Beach',
    type: 'Family',
    price: 15000,
    originalPrice: 18000,
    duration: '4D/3N',
    durationDays: 4,
    durationNights: 3,
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Experience the ultimate beach getaway with sun, sand, and vibrant nightlife.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Ooty Hill Retreat',
    destination: 'Ooty',
    country: 'India',
    category: 'Hill Station',
    type: 'Family',
    price: 12000,
    originalPrice: 15000,
    duration: '3D/2N',
    durationDays: 3,
    durationNights: 2,
    coverImage: 'https://images.unsplash.com/photo-1579893962660-84a1e956e1b6?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Relax in the serene hills of Ooty, surrounded by tea gardens and mist.',
    isFeatured: false,
    isBestSeller: false
  },
  {
    title: 'Kodaikanal Nature Walk',
    destination: 'Kodaikanal',
    country: 'India',
    category: 'Hill Station',
    type: 'Family',
    price: 14000,
    duration: '4D/3N',
    durationDays: 4,
    durationNights: 3,
    coverImage: 'https://images.unsplash.com/photo-1594916843058-29e8432b0051?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Discover the Princess of Hill Stations with beautiful lakes and valleys.',
    isFeatured: true,
    isBestSeller: false
  },
  {
    title: 'Munnar Tea Gardens Escapade',
    destination: 'Munnar',
    country: 'India',
    category: 'Hill Station',
    type: 'Honeymoon',
    price: 16000,
    duration: '4D/3N',
    durationDays: 4,
    durationNights: 3,
    coverImage: 'https://images.unsplash.com/photo-1593693397690-362bb9a107bf?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'A romantic getaway amidst the lush green tea plantations of Kerala.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Kerala Backwaters Houseboat',
    destination: 'Kerala Backwaters',
    country: 'India',
    category: 'Luxury',
    type: 'Honeymoon',
    price: 25000,
    originalPrice: 30000,
    duration: '3D/2N',
    durationDays: 3,
    durationNights: 2,
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Cruise along the tranquil backwaters in a premium traditional houseboat.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Coorg Coffee Trail',
    destination: 'Coorg',
    country: 'India',
    category: 'Hill Station',
    type: 'Adventure',
    price: 11000,
    duration: '3D/2N',
    durationDays: 3,
    durationNights: 2,
    coverImage: 'https://images.unsplash.com/photo-1588698188165-22b27ccfb7b2?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Explore coffee estates and waterfalls in the Scotland of India.',
    isFeatured: false,
    isBestSeller: false
  },
  {
    title: 'Andaman Scuba Adventure',
    destination: 'Andaman',
    country: 'India',
    category: 'Adventure',
    type: 'Adventure',
    price: 35000,
    originalPrice: 40000,
    duration: '6D/5N',
    durationDays: 6,
    durationNights: 5,
    coverImage: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Dive into crystal clear waters and explore vibrant coral reefs.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Manali Snow Trek',
    destination: 'Manali',
    country: 'India',
    category: 'Adventure',
    type: 'Adventure',
    price: 18000,
    duration: '5D/4N',
    durationDays: 5,
    durationNights: 4,
    coverImage: 'https://images.unsplash.com/photo-1596706798150-5d666d6c49cc?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Trek through the snow-capped Himalayas and enjoy thrilling winter sports.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Kashmir Valley Tour',
    destination: 'Kashmir',
    country: 'India',
    category: 'Luxury',
    type: 'Family',
    price: 45000,
    originalPrice: 50000,
    duration: '7D/6N',
    durationDays: 7,
    durationNights: 6,
    coverImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Experience heaven on earth with a luxurious stay in the Kashmir valley.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Jaipur Royal Heritage',
    destination: 'Jaipur',
    country: 'India',
    category: 'Cultural',
    type: 'Family',
    price: 13000,
    duration: '4D/3N',
    durationDays: 4,
    durationNights: 3,
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Explore the majestic forts and palaces of the Pink City.',
    isFeatured: true,
    isBestSeller: false
  },
  {
    title: 'Udaipur Lakes & Palaces',
    destination: 'Udaipur',
    country: 'India',
    category: 'Luxury',
    type: 'Honeymoon',
    price: 28000,
    originalPrice: 32000,
    duration: '4D/3N',
    durationDays: 4,
    durationNights: 3,
    coverImage: 'https://images.unsplash.com/photo-1615836245337-f839dff0a153?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Live like royalty in the City of Lakes with premium accommodations.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Rishikesh Yoga Retreat',
    destination: 'Rishikesh',
    country: 'India',
    category: 'Pilgrimage',
    type: 'Adventure',
    price: 9000,
    duration: '3D/2N',
    durationDays: 3,
    durationNights: 2,
    coverImage: 'https://images.unsplash.com/photo-1626296726880-77a8b417eef4?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Find peace and adventure on the banks of the sacred Ganges river.',
    isFeatured: false,
    isBestSeller: false
  },
  {
    title: 'Jim Corbett Wildlife Safari',
    destination: 'Jim Corbett',
    country: 'India',
    category: 'Wildlife',
    type: 'Family',
    price: 17000,
    duration: '4D/3N',
    durationDays: 4,
    durationNights: 3,
    coverImage: 'https://images.unsplash.com/photo-1615962122149-ea68def932ce?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Thrilling jeep safaris to spot the majestic Bengal tiger in the wild.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Mysore Palace Tour',
    destination: 'Mysore',
    country: 'India',
    category: 'Cultural',
    type: 'Family',
    price: 10000,
    duration: '3D/2N',
    durationDays: 3,
    durationNights: 2,
    coverImage: 'https://images.unsplash.com/photo-1600100397608-f010f41cb8ea?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Discover the rich cultural heritage and grand architecture of Mysore.',
    isFeatured: false,
    isBestSeller: false
  },
  {
    title: 'Bali Exotic Getaway',
    destination: 'Bali',
    country: 'Indonesia',
    category: 'Beach',
    type: 'International',
    price: 55000,
    originalPrice: 65000,
    duration: '7D/6N',
    durationDays: 7,
    durationNights: 6,
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Experience beautiful temples, beaches, and vibrant culture in Bali.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Maldives Paradise Escape',
    destination: 'Maldives',
    country: 'Maldives',
    category: 'Luxury',
    type: 'International',
    price: 120000,
    originalPrice: 150000,
    duration: '5D/4N',
    durationDays: 5,
    durationNights: 4,
    coverImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Unwind in luxury overwater bungalows over crystal clear turquoise waters.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Dubai Luxury Retreat',
    destination: 'Dubai',
    country: 'UAE',
    category: 'Luxury',
    type: 'International',
    price: 85000,
    originalPrice: 95000,
    duration: '6D/5N',
    durationDays: 6,
    durationNights: 5,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Experience modern marvels, desert safaris, and world-class shopping.',
    isFeatured: true,
    isBestSeller: true
  },
  {
    title: 'Singapore City Explorer',
    destination: 'Singapore',
    country: 'Singapore',
    category: 'International',
    type: 'Family',
    price: 65000,
    duration: '5D/4N',
    durationDays: 5,
    durationNights: 4,
    coverImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Explore the futuristic gardens, universal studios, and vibrant city life.',
    isFeatured: true,
    isBestSeller: false
  },
  {
    title: 'Rajasthan Desert Safari',
    destination: 'Jaisalmer',
    country: 'India',
    category: 'Adventure',
    type: 'Adventure',
    price: 22000,
    duration: '4D/3N',
    durationDays: 4,
    durationNights: 3,
    coverImage: 'https://images.unsplash.com/photo-1599955210986-e822072382da?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Camp under the stars in the Thar Desert after a thrilling camel ride.',
    isFeatured: false,
    isBestSeller: false
  },
  {
    title: 'Meghalaya Waterfalls Tour',
    destination: 'Shillong',
    country: 'India',
    category: 'Hill Station',
    type: 'Adventure',
    price: 19000,
    duration: '5D/4N',
    durationDays: 5,
    durationNights: 4,
    coverImage: 'https://images.unsplash.com/photo-1623864074211-1e967a5b3a4a?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Discover living root bridges and spectacular waterfalls in the East.',
    isFeatured: false,
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
  console.log('🔧 Node.js DNS was pointing to localhost — switched to Google/Cloudflare DNS');
}

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://aishwaryas2024cce_db_user:4PUnSerzi5j6KnqI@travelfinal.dp2phjk.mongodb.net/travelgo?retryWrites=true&w=majority&appName=travelfinal';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    for (const pkg of packagesToInsert) {
      // Create packages one by one to ensure auto-incrementing ID works if applicable
      const newPackage = new Package(pkg);
      await newPackage.save();
      console.log(`Inserted package: ${pkg.title}`);
    }

    console.log('Successfully inserted all 20 packages!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

seedDB();
