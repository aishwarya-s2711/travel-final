const mongoose = require('mongoose');
const Package = require('./model/Package');
require('dotenv').config();

const allDestPackages = [
  {
    title: 'Greek Island Hopper',
    destination: 'Santorini',
    country: 'Greece',
    category: 'International',
    type: 'Honeymoon',
    price: 231920,
    originalPrice: 280000,
    duration: '10D/9N',
    durationDays: 10,
    durationNights: 9,
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&fit=crop&auto=format',
    shortDescription: 'Explore the stunning white-washed villages and crystal clear waters of Santorini.',
    detailedDescription: 'Experience the best of Greece with a luxury trip to Santorini. Watch the world-famous Oia sunsets, hike from Fira to Oia, relax at the Red Beach, and tour traditional volcanic islands.',
    isFeatured: true,
    isBestSeller: false,
    highlights: ['Oia Sunsets', 'Red Beach Tour', 'Volcanic Hot Springs', 'Caldera Yacht Cruise'],
    inclusions: ['Luxury Cave Hotel', 'Daily Breakfast', 'Private Catamaran Tour', 'Airport Transfers'],
    exclusions: ['International Flights', 'Travel Insurance', 'Personal Expenses'],
    itinerary: [
      { day: 1, title: 'Arrival & Oia Sunset', desc: 'Arrive at Santorini airport, private transfer to your luxury caldera cave hotel. Evening watch sunset from Oia.' },
      { day: 2, title: 'Caldera Catamaran Cruise', desc: 'Enjoy a half-day catamaran cruise around the Caldera with snorkeling and dinner included.' },
      { day: 3, title: 'Wine Tasting & Fira Exploration', desc: 'Tour three award-winning volcanic wineries, then explore the cobblestone streets of Fira.' }
    ]
  },
  {
    title: 'Maldives Paradise Escape',
    destination: 'Maldives',
    country: 'Maldives',
    category: 'International',
    type: 'Luxury',
    price: 199920,
    originalPrice: 240000,
    duration: '5D/4N',
    durationDays: 5,
    durationNights: 4,
    coverImage: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&fit=crop&auto=format',
    shortDescription: 'Experience ultimate luxury in the pristine waters of the Maldives.',
    detailedDescription: 'Escape to a secluded overwater villa in the Maldives. Snorkel in crystal lagoons, dine underwater, and pamper yourself with premium spa sessions.',
    isFeatured: true,
    isBestSeller: true,
    highlights: ['Overwater Villas', 'Crystal Clear Lagoons', 'Underwater Dining', 'Premium Spa'],
    inclusions: ['Luxury Overwater Villa', 'All Meals (All-Inclusive)', 'Seaplane Transfers', 'Snorkeling Gear'],
    exclusions: ['Flights', 'Additional Excursions', 'Tips'],
    itinerary: [
      { day: 1, title: 'Arrival & Seaplane Ride', desc: 'Arrive at Male Airport and take a scenic seaplane ride to your private island resort.' },
      { day: 2, title: 'Snorkeling Safari', desc: 'Explore the vibrant house reef with a guided snorkeling tour and swim with marine life.' }
    ]
  },
  {
    title: 'Bali Exotic Getaway',
    destination: 'Bali',
    country: 'Indonesia',
    category: 'International',
    type: 'Honeymoon',
    price: 151920,
    originalPrice: 180000,
    duration: '7D/6N',
    durationDays: 7,
    durationNights: 6,
    coverImage: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&fit=crop&auto=format',
    shortDescription: 'Discover the cultural and natural beauty of Bali with your loved one.',
    detailedDescription: 'Uncover ancient temples, lush rice fields, and pristine beaches. Enjoy wellness retreats in Ubud and spectacular sunsets in Seminyak.',
    isFeatured: true,
    isBestSeller: false,
    highlights: ['Uluwatu Temple Sunset', 'Tegallalang Rice Terraces', 'Scuba Diving', 'Ubud Yoga Retreats'],
    inclusions: ['Boutique Resort Stay', 'Daily Breakfast', 'Private Tour Guide', 'Airport Transfers'],
    exclusions: ['Flights', 'Lunch & Dinner', 'Personal Expenses'],
    itinerary: [
      { day: 1, title: 'Welcome to Ubud', desc: 'Arrive in Bali, transfer to your Ubud resort nestled in the jungle.' },
      { day: 2, title: 'Ubud Culture & Rice Terraces', desc: 'Visit Tegallalang rice paddies, Tirta Empul holy spring, and Ubud monkey forest.' }
    ]
  },
  {
    title: 'Swiss Alpine Adventure',
    destination: 'Swiss Alps',
    country: 'Switzerland',
    category: 'International',
    type: 'Adventure',
    price: 263920,
    originalPrice: 310000,
    duration: '8D/7N',
    durationDays: 8,
    durationNights: 7,
    coverImage: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=800&fit=crop&auto=format',
    shortDescription: 'Embark on an unforgettable adventure through the majestic Swiss Alps.',
    detailedDescription: 'Embark on a train journey of a lifetime across Switzerland. Ride the Glacier Express, see the iconic Matterhorn, and enjoy Swiss cheese fondue.',
    isFeatured: true,
    isBestSeller: false,
    highlights: ['Matterhorn Views', 'Glacier Express Ride', 'Jungfraujoch Peak', 'Alpine Hiking'],
    inclusions: ['Alpine Chalets', 'Swiss Travel Pass', 'Mountain Excursion Tickets', 'Daily Breakfast'],
    exclusions: ['Airfare', 'Ski Gear Rental', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Arrive in Zurich & Travel to Zermatt', desc: 'Arrive in Zurich, activate your Swiss Travel Pass, and take the train to Zermatt.' }
    ]
  },
  {
    title: 'Kyoto Historical Zen Tour',
    destination: 'Kyoto',
    country: 'Japan',
    category: 'International',
    type: 'Cultural',
    price: 165000,
    originalPrice: 195000,
    duration: '5D/4N',
    durationDays: 5,
    durationNights: 4,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop&auto=format',
    shortDescription: 'Historic temples, cherry blossoms, and refined Zen gardens.',
    detailedDescription: 'Immerse yourself in Japan\'s ancient capital. Visit the Golden Pavilion, walk through thousands of red Torii gates at Fushimi Inari, and enjoy a traditional tea ceremony.',
    isFeatured: false,
    isBestSeller: false,
    highlights: ['Fushimi Inari Torii Gates', 'Golden Pavilion (Kinkaku-ji)', 'Gion District Walk', 'Bamboo Forest in Arashiyama'],
    inclusions: ['Traditional Ryokan stay', 'Daily Breakfast & Kaiseki Dinner', 'Local Guide', 'Tea Ceremony entry'],
    exclusions: ['Flights', 'Public Transport tickets', 'Drinks'],
    itinerary: [
      { day: 1, title: 'Arrival in Kyoto', desc: 'Check into a classic Ryokan, experience your first multi-course Kaiseki dinner.' },
      { day: 2, title: 'Temples & Bamboo Forests', desc: 'Visit Kinkaku-ji temple and walk through Arashiyama bamboo forest.' }
    ]
  },
  {
    title: 'Marrakech Desert & Souk Oasis',
    destination: 'Marrakech',
    country: 'Morocco',
    category: 'International',
    type: 'Adventure',
    price: 135000,
    originalPrice: 160000,
    duration: '6D/5N',
    durationDays: 6,
    durationNights: 5,
    coverImage: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&fit=crop&auto=format',
    shortDescription: 'Vibrant souks, stunning riads, and exciting Sahara desert excursions.',
    detailedDescription: 'Step into a world of spices, colorful lanterns, and rich history. Explore the Medina of Marrakech, stay in an authentic Riad, and sleep under the stars in the desert.',
    isFeatured: true,
    isBestSeller: false,
    highlights: ['Medina Souks', 'Jardin Majorelle', 'Sahara Desert Camping', 'Traditional Hammam'],
    inclusions: ['Authentic Riad stay', 'Sahara Luxury Desert Camp', 'Daily Breakfast & Dinner', 'Desert Camel Trek'],
    exclusions: ['Flights', 'Lunch & Dinner', 'Tips'],
    itinerary: [
      { day: 1, title: 'Arrival & Riad Check-in', desc: 'Welcome to Marrakech. Settle into your Riad with mint tea.' },
      { day: 2, title: 'Medina & Palaces Tour', desc: 'Discover Bahia Palace, Koutoubia Mosque, and the bustling souks.' }
    ]
  },
  {
    title: 'Dubai Luxury Retreat',
    destination: 'Dubai',
    country: 'UAE',
    category: 'International',
    type: 'Luxury',
    price: 127920,
    originalPrice: 150000,
    duration: '4D/3N',
    durationDays: 4,
    durationNights: 3,
    coverImage: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&fit=crop&auto=format',
    shortDescription: 'Enjoy world-class shopping, dining, and futuristic architecture in Dubai.',
    detailedDescription: 'Experience modern luxury in Dubai. Stand on top of the world at Burj Khalifa, go dune bashing in the desert, and shop at the Gold Souk.',
    isFeatured: false,
    isBestSeller: true,
    highlights: ['Burj Khalifa Observation Deck', 'Desert Safari & BBQ Dinner', 'Dhow Cruise in Marina', 'Gold & Spice Souks'],
    inclusions: ['5-Star Hotel Stay', 'Daily Breakfast', 'Guided City Tour', 'Desert Safari Excursion'],
    exclusions: ['Flights', 'Personal Expenses', 'Visa Fees'],
    itinerary: [
      { day: 1, title: 'Arrival & Dhow Marina Cruise', desc: 'Land in Dubai. Settle in, and take a dinner cruise in Dubai Marina.' }
    ]
  },
  {
    title: 'Paris City of Love Tour',
    destination: 'Paris',
    country: 'France',
    category: 'International',
    type: 'Honeymoon',
    price: 180000,
    originalPrice: 220000,
    duration: '6D/5N',
    durationDays: 6,
    durationNights: 5,
    coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&fit=crop&auto=format',
    shortDescription: 'Experience the romance, culture, and art of Paris.',
    detailedDescription: 'Enjoy the ultimate romantic holiday in Paris. Walk down Champs-Élysées, visit the Louvre Museum, and enjoy a cruise on the River Seine.',
    isFeatured: true,
    isBestSeller: true,
    highlights: ['Eiffel Tower Summit Access', 'Louvre Museum Guided Tour', 'Seine River Cruise', 'Versailles Palace'],
    inclusions: ['Chic Boutique Hotel', 'Daily Breakfast', 'Skip-the-line museum tickets', 'Private Tour Guide'],
    exclusions: ['Airfare', 'Lunch & Dinner', 'Tips'],
    itinerary: [
      { day: 1, title: 'Bienvenue à Paris', desc: 'Arrive in Paris, check in to your boutique hotel, and see the Eiffel Tower lit up at night.' }
    ]
  },
  {
    title: 'Patagonia Wilderness Expedition',
    destination: 'Patagonia',
    country: 'Argentina',
    category: 'Adventure',
    type: 'Adventure',
    price: 250000,
    originalPrice: 300000,
    duration: '10D/9N',
    durationDays: 10,
    durationNights: 9,
    coverImage: 'https://images.unsplash.com/photo-1518090626353-c211b65e9c01?w=800&fit=crop&auto=format',
    shortDescription: 'Trek the breathtaking glaciers and mountains of Patagonia.',
    detailedDescription: 'Explore the edge of the world. Walk on the Perito Moreno Glacier, trek around Mount Fitz Roy, and explore Tierra del Fuego National Park.',
    isFeatured: false,
    isBestSeller: false,
    highlights: ['Perito Moreno Glacier Trekking', 'Mount Fitz Roy Hiking', 'Torres del Paine Excursion', 'Wilderness Lodging'],
    inclusions: ['Eco-lodge accommodation', 'All Meals during treks', 'Professional Mountain Guide', 'All park fees'],
    exclusions: ['Flights', 'Gear rental', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Arrival in El Calafate', desc: 'Land in Patagonia, check into your wilderness lodge and prepare for trekking.' }
    ]
  },
  {
    title: 'Queenstown Extreme Adventure',
    destination: 'Queenstown',
    country: 'New Zealand',
    category: 'Adventure',
    type: 'Adventure',
    price: 210000,
    originalPrice: 240000,
    duration: '7D/6N',
    durationDays: 7,
    durationNights: 6,
    coverImage: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&fit=crop&auto=format',
    shortDescription: 'Adrenaline sports, stunning alpine lakes, and dramatic scenery in New Zealand.',
    detailedDescription: 'Embark on the adventure of a lifetime in the adventure capital of the world. Experience skydiving, bungee jumping, jet boat riding, and explore the breathtaking Milford Sound.',
    isFeatured: true,
    isBestSeller: true,
    highlights: ['Milford Sound Nature Cruise', 'AJ Hackett Bungee Jump', 'Shotover Jet Boat Ride', 'Skyline Gondola & Luge'],
    inclusions: ['Luxury Alpine Resort', 'Daily Breakfast', 'Milford Sound Day Trip', 'Adrenaline Pass (Jet boat & Gondola)'],
    exclusions: ['Flights', 'Skydiving upgrades', 'Dinner'],
    itinerary: [
      { day: 1, title: 'Welcome to Queenstown', desc: 'Arrive in Queenstown. Check in to your lakeside resort, take the Skyline Gondola for panoramic views.' }
    ]
  },
  {
    title: 'Kerala Backwaters Houseboat',
    destination: 'Kerala',
    country: 'India',
    category: 'Family',
    type: 'Honeymoon',
    price: 25000,
    originalPrice: 30000,
    duration: '3D/2N',
    durationDays: 3,
    durationNights: 2,
    coverImage: 'https://images.unsplash.com/photo-1593693397690-362bb9666fc2?w=800&fit=crop&auto=format',
    shortDescription: 'Cruise along the tranquil backwaters in a premium traditional houseboat.',
    detailedDescription: 'Recharge with a serene getaway. Float past lush coconut groves, local villages, and green paddy fields on a private, air-conditioned houseboat.',
    isFeatured: true,
    isBestSeller: true,
    highlights: ['Private Houseboat Cruise', 'Vembanad Lake Views', 'Traditional Kerala Cuisine', 'Ayurvedic Massage'],
    inclusions: ['Premium Houseboat Stay', 'All Meals Onboard', 'Welcome Drink & Snacks', 'Ayurvedic Treatment Voucher'],
    exclusions: ['Transport to Alleppey', 'Personal items', 'Tips'],
    itinerary: [
      { day: 1, title: 'Embarkation & Backwater Cruise', desc: 'Board your private houseboat in Alleppey. Cruise down tranquil canals.' }
    ]
  },
  {
    title: 'Hawaii Tropical Explorer',
    destination: 'Hawaii',
    country: 'USA',
    category: 'Family',
    type: 'Family',
    price: 175000,
    originalPrice: 200500,
    duration: '6D/5N',
    durationDays: 6,
    durationNights: 5,
    coverImage: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&fit=crop&auto=format',
    shortDescription: 'Surfing, volcanic national parks, and golden beaches in Hawaii.',
    detailedDescription: 'Discover the paradise of Oahu and Maui. Learn to surf, visit Pearl Harbor, hike up volcanic craters, and experience a traditional Polynesian Luau feast.',
    isFeatured: false,
    isBestSeller: false,
    highlights: ['Polynesian Luau Feast', 'Pearl Harbor Historic Sites', 'Waikiki Beach Surf Class', 'Volcanic Crater Hiking'],
    inclusions: ['Beachfront Resort Stay', 'Daily Breakfast', 'Traditional Luau Dinner', 'Island Hop Transfers'],
    exclusions: ['Flights', 'Car Rental', 'Optional excursions'],
    itinerary: [
      { day: 1, title: 'Aloha Hawaii!', desc: 'Arrive in Honolulu, receive a traditional flower lei greeting, and check into your beachfront resort.' }
    ]
  },
  {
    title: 'Cape Town Coastal Wonders',
    destination: 'Cape Town',
    country: 'South Africa',
    category: 'International',
    type: 'Family',
    price: 145000,
    originalPrice: 170000,
    duration: '6D/5N',
    durationDays: 6,
    durationNights: 5,
    coverImage: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&fit=crop&auto=format',
    shortDescription: 'Table Mountain, Cape Peninsula scenic drives, and Boulders Beach penguins.',
    detailedDescription: 'Take in the majestic sights of South Africa\'s Mother City. Ride the Cableway up Table Mountain, explore Cape Point, and taste world-class wines in Stellenbosch.',
    isFeatured: true,
    isBestSeller: false,
    highlights: ['Table Mountain Aerial Cableway', 'Cape Point Scenic Tour', 'Boulders Beach Penguin Colony', 'Stellenbosch Wine Tasting'],
    inclusions: ['4-Star Waterfront Hotel', 'Daily Breakfast', 'Cape Peninsula Day Tour', 'Wine Estate entry'],
    exclusions: ['Flights', 'Dinner', 'Tips'],
    itinerary: [
      { day: 1, title: 'Arrival & Waterfront Exploring', desc: 'Arrive in Cape Town, transfer to your hotel near the V&A Waterfront.' }
    ]
  },
  {
    title: 'Reykjavik Northern Lights Escape',
    destination: 'Reykjavik',
    country: 'Iceland',
    category: 'Adventure',
    type: 'Adventure',
    price: 230000,
    originalPrice: 265000,
    duration: '6D/5N',
    durationDays: 6,
    durationNights: 5,
    coverImage: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&fit=crop&auto=format',
    shortDescription: 'Chasing the Northern Lights, geothermal Blue Lagoon, and Golden Circle waterfalls.',
    detailedDescription: 'Adventure into Iceland\'s geysers, glaciers, and geothermal pools. Relax in the warm waters of the Blue Lagoon, and drive through the iconic Golden Circle route.',
    isFeatured: true,
    isBestSeller: true,
    highlights: ['Guided Northern Lights Hunt', 'Blue Lagoon Geothermal Spa', 'Golden Circle Waterfall Tour', 'Black Sand Beaches'],
    inclusions: ['Premium Boutique Hotel', 'Daily Breakfast', 'Blue Lagoon Premium Admission', 'Icelandic Superjeep Tour'],
    exclusions: ['Flights', 'Thermal gear rental', 'Meals not specified'],
    itinerary: [
      { day: 1, title: 'Blue Lagoon Spa Relaxation', desc: 'Arrive in Iceland. Transfer directly to the Blue Lagoon to soak in mineral-rich geothermal waters.' }
    ]
  },
  {
    title: 'Singapore Futuristic Marina Tour',
    destination: 'Singapore',
    country: 'Singapore',
    category: 'International',
    type: 'Family',
    price: 120000,
    originalPrice: 140000,
    duration: '5D/4N',
    durationDays: 5,
    durationNights: 4,
    coverImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&fit=crop&auto=format',
    shortDescription: 'Futuristic Gardens by the Bay, Universal Studios, and shopping at Marina Bay Sands.',
    detailedDescription: 'Step into the futuristic garden city. Walk along the supertrees at Gardens by the Bay, explore Universal Studios on Sentosa Island, and enjoy spectacular skyline light shows.',
    isFeatured: false,
    isBestSeller: true,
    highlights: ['Gardens by the Bay Avatar Experience', 'Universal Studios Singapore Pass', 'Marina Bay Sands Observation Deck', 'Night Safari'],
    inclusions: ['Centrally located hotel', 'Daily Breakfast', 'All entry attraction tickets', 'Private Transfers'],
    exclusions: ['Flights', 'Meals not specified', 'Personal items'],
    itinerary: [
      { day: 1, title: 'Arrival & Night Safari', desc: 'Land in Singapore. Settle in, and visit the world\'s first nocturnal zoo safari.' }
    ]
  },
  {
    title: 'Tokyo Cultural Journey',
    destination: 'Tokyo',
    country: 'Japan',
    category: 'International',
    type: 'Family',
    price: 195000,
    originalPrice: 230000,
    duration: '7D/6N',
    durationDays: 7,
    durationNights: 6,
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800&fit=crop&auto=format',
    shortDescription: 'Explore the neon lights, shrines, and culinary wonders of Tokyo.',
    detailedDescription: 'Discover the contrast between tradition and technology. Explore Shibuya Crossing, pray at Meiji Shrine, make sushi with masters, and visit Mt Fuji.',
    isFeatured: true,
    isBestSeller: true,
    highlights: ['Shibuya Crossing Walk', 'Senso-ji Ancient Temple', 'Mt. Fuji Day Tour', 'Traditional Sushi Workshop'],
    inclusions: ['4-Star Shinjuku Hotel', 'Daily Breakfast', 'Mt Fuji Guided Tour', 'Airport Transfers'],
    exclusions: ['Flights', 'Public Metro pass', 'Dinner'],
    itinerary: [
      { day: 1, title: 'Welcome to Tokyo', desc: 'Arrive in Tokyo, private transfer to Shinjuku. Explore neon streets in evening.' }
    ]
  },
  {
    title: 'Cairo Ancient Wonders',
    destination: 'Cairo',
    country: 'Egypt',
    category: 'Cultural',
    type: 'Family',
    price: 110000,
    originalPrice: 130000,
    duration: '5D/4N',
    durationDays: 5,
    durationNights: 4,
    coverImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?w=800&fit=crop&auto=format',
    shortDescription: 'Discover the Great Pyramids and ancient history along the Nile.',
    detailedDescription: 'Step back in time to the land of Pharaohs. Behold the Sphinx and Great Pyramids of Giza, sail on a Felucca on the Nile, and shop at the Khan el-Khalili Bazaar.',
    isFeatured: false,
    isBestSeller: false,
    highlights: ['Great Pyramids of Giza', 'The Great Sphinx', 'Egyptian Museum Mummies', 'Nile Felucca Sailing'],
    inclusions: ['5-Star Nile View Hotel', 'Daily Breakfast & Lunch', 'Egyptologist Tour Guide', 'Entry tickets to Pyramids area'],
    exclusions: ['Flights', 'Pyramid interior entry tickets', 'Tips'],
    itinerary: [
      { day: 1, title: 'Arrival & Nile Dinner Cruise', desc: 'Arrive in Cairo, transfer to hotel. Enjoy an evening cruise on the Nile with folklore show.' }
    ]
  },
  {
    title: 'Sydney Harbour Getaway',
    destination: 'Sydney',
    country: 'Australia',
    category: 'International',
    type: 'Family',
    price: 220000,
    originalPrice: 250000,
    duration: '8D/7N',
    durationDays: 8,
    durationNights: 7,
    coverImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&fit=crop&auto=format',
    shortDescription: 'Enjoy iconic landmarks, stunning beaches, and wildlife in Sydney.',
    detailedDescription: 'Soak in the sights of Sydney Harbour. Tour the world-famous Opera House, cruise under the Harbour Bridge, surf at Bondi Beach, and explore the Blue Mountains.',
    isFeatured: true,
    isBestSeller: false,
    highlights: ['Sydney Opera House Guided Tour', 'Bondi Beach Surfing lesson', 'Blue Mountains Scenic World', 'Harbour Dinner Cruise'],
    inclusions: ['Luxury Harbour View Hotel', 'Daily Breakfast', 'Blue Mountains Day Trip', 'Airport Transfers'],
    exclusions: ['Airfare', 'Lunch & Dinner', 'Drinks'],
    itinerary: [
      { day: 1, title: 'Arrival & Sydney Tower Eye', desc: 'Arrive in Sydney, check into hotel. Visit Sydney Tower for 360-degree orientation views.' }
    ]
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

    // Wipe out old packages with matching destinations to ensure we have a clean list
    const destinationsToClean = allDestPackages.map(p => p.destination);
    destinationsToClean.push('Swiss Alps', 'Switzerland', 'Kerala Backwaters');
    
    console.log('Cleaning old packages for: ', destinationsToClean);
    await Package.deleteMany({ destination: { $in: destinationsToClean } });

    for (const pkg of allDestPackages) {
      const newPackage = new Package(pkg);
      await newPackage.save();
      console.log(`Inserted package: ${pkg.title} (${pkg.destination})`);
    }

    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDB();
