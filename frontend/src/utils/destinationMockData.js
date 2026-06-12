export const getDestinationDetails = (destName) => {
  const name = destName.toLowerCase();
  
  if (name.includes('bali')) {
    return {
      description: 'Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple.',
      bestTime: 'April to October during the dry season.',
      attractions: ['Uluwatu Temple', 'Tegallalang Rice Terrace', 'Sacred Monkey Forest Sanctuary', 'Mount Batur'],
      activities: ['Surfing in Kuta', 'Yoga retreats in Ubud', 'Scuba diving in Nusa Penida', 'Traditional Balinese Cooking Class'],
      tips: ['Dress modestly when visiting temples', 'Be prepared to bargain in markets', 'Drink bottled water'],
      accommodations: ['Luxury Villa in Seminyak - $300/night', 'Boutique Resort in Ubud - $120/night', 'Beachfront Hostel - $25/night'],
      nearby: ['Nusa Penida (45min boat)', 'Gili Islands (2hr boat)'],
      budget: '$50 - $150 per day'
    };
  }
  
  if (name.includes('paris')) {
    return {
      description: 'Paris, France\'s capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.',
      bestTime: 'April to June and October to early November.',
      attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Palace of Versailles'],
      activities: ['Seine River Cruise', 'Wine and Cheese Tasting', 'Montmartre Walking Tour', 'Cabaret Show'],
      tips: ['Learn a few basic French phrases', 'Beware of pickpockets in tourist areas', 'Use the Metro for getting around'],
      accommodations: ['5-Star Hotel near Champs-Élysées - $450/night', 'Boutique Hotel in Le Marais - $180/night', 'Budget Hotel - $80/night'],
      nearby: ['Disneyland Paris (40min train)', 'Versailles (1hr train)'],
      budget: '$150 - $350 per day'
    };
  }

  if (name.includes('dubai')) {
    return {
      description: 'Dubai is a city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture and a lively nightlife scene. Burj Khalifa, an 830m-tall tower, dominates the skyscraper-filled skyline.',
      bestTime: 'November to March for pleasant winter weather.',
      attractions: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Dubai Fountain'],
      activities: ['Desert Safari', 'Dhow Cruise Dinner', 'Skydiving over The Palm', 'Shopping at Gold Souk'],
      tips: ['Respect local dress codes', 'Weekends are Friday and Saturday', 'Taxis are cheap and reliable'],
      accommodations: ['Luxury Hotel in Downtown - $400/night', 'Beach Resort - $250/night', 'Business Hotel - $100/night'],
      nearby: ['Abu Dhabi (1.5hr drive)', 'Sharjah (40min drive)'],
      budget: '$200 - $500 per day'
    };
  }

  if (name.includes('santorini')) {
    return {
      description: 'Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The whitewashed, cubiform houses of its 2 principal towns cling to cliffs.',
      bestTime: 'September to October and April to May.',
      attractions: ['Oia Sunsets', 'Red Beach', 'Akrotiri Archaeological Site', 'Fira Town'],
      activities: ['Catamaran Caldera Cruise', 'Wine Tasting Tour', 'Hiking from Fira to Oia', 'Volcano Hot Springs'],
      tips: ['Book sunset dinner reservations well in advance', 'Wear comfortable walking shoes for cobblestones', 'Rent an ATV to explore the island'],
      accommodations: ['Caldera View Cave Hotel - $500/night', 'Boutique Hotel in Fira - $200/night', 'Guesthouse in Perissa - $80/night'],
      nearby: ['Mykonos (2.5hr ferry)', 'Ios (1hr ferry)'],
      budget: '$150 - $400 per day'
    };
  }

  if (name.includes('patagonia')) {
    return {
      description: 'Patagonia is a sparsely populated region located at the southern end of South America, shared by Argentina and Chile. The region comprises the southern section of the Andes mountains, lakes, fjords, and glaciers.',
      bestTime: 'November to early March (Southern Hemisphere Summer).',
      attractions: ['Perito Moreno Glacier', 'Torres del Paine National Park', 'Mount Fitz Roy', 'Tierra del Fuego'],
      activities: ['Glacier Trekking', 'Multi-day Hiking', 'Penguin Colony Tours', 'Kayaking'],
      tips: ['Weather changes rapidly, pack layers', 'Book accommodations months in advance', 'Prepare for high winds'],
      accommodations: ['Eco-Lodge - $300/night', 'Mountain Refugio - $80/night', 'Hostel in El Calafate - $40/night'],
      nearby: ['Ushuaia (Flight required)', 'Bariloche (Flight required)'],
      budget: '$100 - $250 per day'
    };
  }

  if (name.includes('swiss') || name.includes('switzerland')) {
    return {
      description: 'The Swiss Alps offer some of the most dramatic and breathtaking mountain scenery in the world. Famous for world-class skiing, pristine alpine lakes, and charming villages.',
      bestTime: 'December to March for winter sports; June to September for hiking.',
      attractions: ['Matterhorn', 'Jungfraujoch', 'Lake Geneva', 'Chateau de Chillon'],
      activities: ['Skiing & Snowboarding', 'Glacier Express Train Ride', 'Alpine Hiking', 'Cheese & Chocolate Tasting'],
      tips: ['Purchase a Swiss Travel Pass', 'Everything is closed on Sundays', 'Tap water is drinkable and delicious'],
      accommodations: ['Luxury Ski Resort - $600/night', 'Traditional Chalet - $250/night', 'Alpine Hostel - $70/night'],
      nearby: ['Milan, Italy (3hr train)', 'Chamonix, France (1.5hr drive)'],
      budget: '$250 - $500 per day'
    };
  }

  if (name.includes('tokyo')) {
    return {
      description: 'Tokyo, Japan’s bustling capital, mixes ultramodern neon skyscrapers with historic Shinto shrines. The city is also famous for its incredible dining scene, cherry blossom parks, and anime culture.',
      bestTime: 'March to April (Cherry Blossoms) and October to November.',
      attractions: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree', 'Meiji Jingu Shrine'],
      activities: ['Sushi making class', 'Mario Kart street racing', 'Ghibli Museum tour', 'Harajuku shopping'],
      tips: ['Get a Suica or Pasmo card for transport', 'Tipping is not customary and can be offensive', 'Keep your trash with you as public bins are rare'],
      accommodations: ['Luxury High-rise Hotel in Shinjuku - $420/night', 'Boutique Ryokan - $220/night', 'Capsule Hotel - $45/night'],
      nearby: ['Mount Fuji (2hr train)', 'Kamakura (1hr train)'],
      budget: '$150 - $350 per day'
    };
  }

  if (name.includes('cairo') || name.includes('egypt')) {
    return {
      description: 'Cairo, Egypt’s sprawling capital, is set on the Nile River. At its heart is Tahrir Square and the vast Egyptian Museum, home to a trove of antiquities including Royal Mummies and King Tutankhamun’s treasures.',
      bestTime: 'October to April when temperatures are cooler.',
      attractions: ['Great Pyramids of Giza', 'The Egyptian Museum', 'Khan el-Khalili Bazaar', 'Cairo Citadel'],
      activities: ['Felucca boat ride on the Nile', 'Camel riding at Giza', 'Sound & Light show at the Pyramids', 'Islamic Cairo walking tour'],
      tips: ['Always carry small cash notes for tips (baksheesh)', 'Dress conservatively in public spaces', 'Agree on taxi prices before starting'],
      accommodations: ['Luxury Nile View Hotel - $280/night', 'Historic Palace Hotel - $190/night', 'Cozy Downtown Guesthouse - $50/night'],
      nearby: ['Alexandria (2.5hr drive)', 'Saqqara Step Pyramid (45min drive)'],
      budget: '$70 - $180 per day'
    };
  }

  if (name.includes('sydney')) {
    return {
      description: 'Sydney, capital of New South Wales and one of Australia\'s largest cities, is best known for its harborfront Sydney Opera House, with a distinctive sail-like design. The massive Darling Harbour and Circular Quay port are hubs of waterside life.',
      bestTime: 'September to November and March to May.',
      attractions: ['Sydney Opera House', 'Sydney Harbour Bridge', 'Bondi Beach', 'Royal Botanic Garden'],
      activities: ['BridgeClimb Sydney', 'Surfing lesson at Bondi', 'Taronga Zoo ferry ride', 'Coogee to Bondi coastal walk'],
      tips: ['Use an Opal card or contactless card for public transport', 'Always swim between the red and yellow flags', 'Apply high-factor sunscreen daily'],
      accommodations: ['5-Star Circular Quay Hotel - $390/night', 'Harbor View Apartment - $240/night', 'Bondi Surf Hostel - $55/night'],
      nearby: ['Blue Mountains (2hr train)', 'Hunter Valley Wine Region (2hr drive)'],
      budget: '$160 - $380 per day'
    };
  }

  // Default Fallback
  return {
    description: `A stunning destination filled with rich culture, breathtaking landscapes, and unforgettable experiences. Discover the beauty of ${destName} and create lifelong memories.`,
    bestTime: 'Spring and Autumn offer the most pleasant weather conditions for exploring.',
    attractions: ['Historic Old Town', 'Local Museums', 'Panoramic Viewpoints', 'Famous Night Markets'],
    activities: ['Guided City Tours', 'Local Culinary Tasting', 'Nature Hiking', 'Cultural Performances'],
    tips: ['Learn a few local phrases', 'Respect local customs and traditions', 'Always carry a little cash'],
    accommodations: ['Luxury Resort & Spa - $350/night', 'Boutique Hotel - $150/night', 'Cozy Guesthouse - $60/night'],
    nearby: ['Neighboring Historic City (2hr train)', 'Nature Reserve (1hr drive)'],
    budget: '$100 - $300 per day'
  };
};
