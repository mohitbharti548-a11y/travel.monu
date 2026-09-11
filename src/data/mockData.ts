import { Destination, Stay, LocalGuide, TourPackage, ReelPost, TransitOption, BookingItem, CustomTripRequest } from '../types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'manali',
    name: 'Manali',
    hindiName: 'मनाली',
    tagline: 'Valley of the Gods & Ancient Pine Forests',
    altitude: '2,050 m (6,726 ft)',
    temperature: '14°C ⛅',
    bestTimeToVisit: 'March – June & Oct – Feb (Snow)',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
    description: 'Set amidst cedar forests and snow-draped Dhauladhar peaks, Manali blends old Himachali heritage with thrilling adventures through Solang, Sethan, and the high-altitude Atal Tunnel gateway.',
    mustVisitSpots: ['Old Manali Heritage Village', 'Jogini Waterfalls Trail', 'Sethan Igloo & Apple Orchards', 'Atal Tunnel to Sissu'],
    secretSpot: {
      title: 'Majach Village Pine Meadow',
      description: 'A secluded 45-minute pine ridge hike beyond Old Manali with zero commercial footfall, direct views of Friendship Peak, and crystal fresh natural spring water.',
      bestTime: 'Sunrise (6:30 AM) or Sunset',
      creatorTip: 'Carry a thermos of fresh chai from Babaji cafe at the trailhead and sit at the wooden cedar bench near the stream.'
    },
    startingPrice: 12499,
    popularActivities: ['Paragliding in Solang', 'Cedar Forest Cafe Trail', 'Sethan Off-roading', 'Hot Sulphur Baths at Vashisht']
  },
  {
    id: 'spiti',
    name: 'Spiti Valley',
    hindiName: 'स्पीति घाटी',
    tagline: 'The Middle Land • High Altitude Desert & Stargazing',
    altitude: '3,800 m (12,500 ft)',
    temperature: '-2°C ❄️',
    bestTimeToVisit: 'June – October (Roads Open) / Feb (Snow Expedition)',
    heroImage: 'https://cdn1.matadornetwork.com/blogs/1/2021/03/Dhankar-Gompa-monastery-1200x853.jpg',
    description: 'A surreal cold desert wonderland where ancient Tibetan Buddhist monasteries perch on sheer cliffs and the Milky Way illuminates the Himalayan night sky with crystal brilliance.',
    mustVisitSpots: ['Key Monastery 1,000-year shrine', 'Chicham Bridge (Asia Highest)', 'Hikkim Highest Post Office', 'Dhankar Cliffside Monastery'],
    secretSpot: {
      title: 'Tashigang Star Ridge & Fossil Trail',
      description: 'Perched above Langza at 4,400m, Tashigang has only 4 resident families and the lowest light pollution index in India. Marine Tethys fossils rest right along the shepherd trail.',
      bestTime: 'Night Stargazing (10:00 PM – 2:00 AM)',
      creatorTip: 'Bring your tripod; you can capture the Key Monastery silhouette framed right beneath the galactic core.'
    },
    startingPrice: 24999,
    popularActivities: ['Milky Way Astro-Photography', 'Fossil Hunting in Langza', 'Chicham Gorge Zip Experience', 'Monastery Morning Chants']
  },
  {
    id: 'kaza',
    name: 'Kaza',
    hindiName: 'काज़ा',
    tagline: 'The Heart of Spiti & Cultural Crossroads',
    altitude: '3,650 m (11,980 ft)',
    temperature: '1°C 🌤️',
    bestTimeToVisit: 'May – October',
    heroImage: 'https://cdn1.matadornetwork.com/blogs/1/2021/03/Dhankar-Gompa-monastery-1200x853.jpg',
    description: 'The administrative heart of Spiti, Kaza is a vibrant tribal outpost with organic sea-buckthorn cafes, Tibetan craft markets, and the gateway to high-altitude passes.',
    mustVisitSpots: ['Kaza Main Market & Craft Bazaar', 'Sakya Tengyeling Gompa', 'Spiti River Pebble Beach', 'Highest Fuel Station in World (Kaza)'],
    secretSpot: {
      title: 'Rambir Riverside Willow Grove',
      description: 'A quiet bend along the braided turquoise Spiti River flanked by yellow wild willows, where Himalayan blue sheep frequently graze in the late afternoon.',
      bestTime: '4:00 PM Golden Hour',
      creatorTip: 'Try the fresh Seabuckthorn tea brewed with local honey at the solar cafe right by the river.'
    },
    startingPrice: 18999,
    popularActivities: ['Seabuckthorn Tasting', 'Yak Wool Weaving Workshop', 'Motorbike Circuit Rendezvous', 'Riverside Campfire']
  },
  {
    id: 'dharamshala',
    name: 'Dharamshala & McLeodGanj',
    hindiName: 'धर्मशाला',
    tagline: 'Little Lhasa • Cedar Mist & Tibetan Heritage',
    altitude: '1,750 m (5,740 ft)',
    temperature: '18°C 🌦️',
    bestTimeToVisit: 'September – June',
    heroImage: 'https://anthilladventures.com/wp-content/uploads/2018/07/2.png',
    description: 'Home to His Holiness the Dalai Lama and the Tibetan government in exile, nestled below the imposing rocky towers of the Dhauladhar range amidst lush tea gardens.',
    mustVisitSpots: ['Tsuglagkhang Complex', 'Triund Mountain Ridge Trail', 'Norbulingka Tibetan Institute', 'Dharamkot Bohemian Village'],
    secretSpot: {
      title: 'Gallu Waterfall Hidden Stream Pool',
      description: 'Beyond Gallu Devi temple on the quiet path to Kareri, this cascading glacial pool is secluded from regular McLeod tourists and surrounded by rhododendron flowers.',
      bestTime: 'Early Morning 8:00 AM',
      creatorTip: 'Pick up Tibetan Tingmo and spicy Momos from Ama Cafe in McLeod before hiking up.'
    },
    startingPrice: 9999,
    popularActivities: ['Triund Trek with Tent Stay', 'Tibetan Thangka Painting Session', 'Kangra Valley Tea Tasting', 'Meditation & Sound Bowls']
  },
  {
    id: 'shimla',
    name: 'Shimla',
    hindiName: 'शिमला',
    tagline: 'Queen of Hills • Colonial Charm & Oak Canopies',
    altitude: '2,276 m (7,467 ft)',
    temperature: '16°C ☀️',
    bestTimeToVisit: 'Year-Round (Dec-Jan for White Christmas)',
    heroImage: 'https://images.unsplash.com/photo-1562670652-e5947bddb335?auto=format&fit=crop&w=1600&q=80',
    description: 'The historic summer capital of British India with pedestrianized Ridge promenades, Tudor-style heritage buildings, dense deodar forests, and vintage Toy Train rides.',
    mustVisitSpots: ['The Ridge & Christ Church', 'Viceregal Lodge (IIAS)', 'Jakhu Temple & Ropeway', 'Mashobra Apple & Cedar Trail'],
    secretSpot: {
      title: 'Craignano Fruit Orchards & Nature Path',
      description: 'An Italian-style cedar estate near Mashobra built in 1890 with manicured alpine moss pathways, wild apple trees, and zero traffic noise.',
      bestTime: 'Spring (April) or Autumn (October)',
      creatorTip: 'The heritage water supply pond has ancient stone benches that look out straight across the Shivalik foothills.'
    },
    startingPrice: 8999,
    popularActivities: ['Kalka-Shimla Toy Train Heritage', 'Mashobra Forest Glamping', 'Heritage Architecture Walk', 'Ice Skating (Winter)']
  },
  {
    id: 'kullu',
    name: 'Kullu',
    hindiName: 'कुल्लू',
    tagline: 'Valley of Apple Orchards & Beas River Rafting',
    altitude: '1,279 m (4,196 ft)',
    temperature: '20°C ☀️',
    bestTimeToVisit: 'September – November (Dussehra) & March – June',
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrYGRuLVn-ZIXoxJPIRMGHQsR-HyrseGmcWSXcwFZQ9Q&s=10',
    description: 'Famed for traditional handloom Kullu shawls, vibrant devta temples, surging white water rapids of the Beas River, and the serene Tirthan Valley gateway.',
    mustVisitSpots: ['Bijli Mahadev Scenic Peak', 'Beas White Water Rafting Stretch', 'Naggar Castle & Roerich Art Gallery', 'Great Himalayan National Park Gateway'],
    secretSpot: {
      title: 'Jana Waterfall Traditional Himachali Kitchen',
      description: 'Hidden in a cedar ravine beyond Naggar, featuring a centuries-old wooden bridge and an authentic open-hearth kitchen serving Siddu, red rice, and walnut chutney.',
      bestTime: 'Lunch time (1:00 PM)',
      creatorTip: 'Ask for the steaming hot Siddu with pure ghee made from indigenous Pahadi cow milk.'
    },
    startingPrice: 7999,
    popularActivities: ['Beas River Grade IV Rafting', 'Traditional Siddu Culinary Workshop', 'Naggar Castle Sunset Art Session', 'Trout Angling in Tirthan']
  },
  {
    id: 'mandi',
    name: 'Mandi',
    hindiName: 'मंडी',
    tagline: 'Varanasi of the Hills • 81 Ancient Stone Temples',
    altitude: '850 m (2,790 ft)',
    temperature: '22°C ⛅',
    bestTimeToVisit: 'October – April',
    heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=80',
    description: 'A historic river city on the banks of the Beas boasting 81 intricately carved stone shikhara temples, the gateway to Prashar Lake and the mystical floating island.',
    mustVisitSpots: ['Prashar Lake & 3-Tier Pagoda Temple', 'Bhootnath Temple', 'Rewalsar Holy Lake (Tso Pema)', 'Victoria Suspension Bridge'],
    secretSpot: {
      title: 'Prashar Lake Sunset Ridge Camp',
      description: 'The high alpine ridge 300m above Prashar Lake where you look down at the mystery floating island while the sun sinks behind the Pir Panjal ranges.',
      bestTime: 'Sunset & Early Dawn',
      creatorTip: 'The local temple priests serve hot Kadi-Chawal inside the community langar hall—humble and heartwarming.'
    },
    startingPrice: 6999,
    popularActivities: ['Prashar Lake Snow Trek', 'Rewalsar Cave Monastery Tour', 'Stone Temple Heritage Exploration', 'Beas Riverside Camp']
  },
  {
    id: 'chamba',
    name: 'Chamba & Khajjiar',
    hindiName: 'चंबा एवं खज्जियार',
    tagline: 'Valley of Milk & Honey • 1000-Yr Royal Temples & Mini Switzerland',
    altitude: '996 m to 4,414 m (Saach Pass)',
    temperature: '17°C ⛅',
    bestTimeToVisit: 'March – June (Meadows) & Sept – Nov (Pleasant)',
    heroImage: 'https://s7ap1.scene7.com/is/image/incredibleindia/manimahesh-lake-chamba-himachal-pradesh-1-attr-hero?qlt=82&ts=1726730465417',
    description: 'Steeped in 1,000 years of unbroken royal heritage on the banks of the Ravi, Chamba is famed for its 10th-century Laxmi Narayan shikhara temples, GI-tagged Chamba Rumal embroidery, emerald cedar meadows of Khajjiar, and thrilling high-pass circuits through Saach Pass & Manimahesh Kailash.',
    mustVisitSpots: ['Khajjiar Pine Meadow & Mini Switzerland Lake', 'Laxmi Narayan 10th-Century Royal Temple Complex', 'Chamera Emerald Lake & Speedboating', 'Bharmour Chaurasi 84-Temple Complex', 'Kalatop Deodar Wildlife Sanctuary'],
    secretSpot: {
      title: 'Pohani Dhar & Kalatop Ridge Trail',
      description: 'A secluded high forest ridge 2,750m above Dalhousie with 360-degree vistas of the Pir Panjal snow crests, wild yellow buttercup slopes, and zero commercial noise.',
      bestTime: '4:30 PM Golden Hour & Sunset',
      creatorTip: 'Taste authentic spicy Chamba Chukh (traditional citrus-chili relish) paired with slow-cooked Madra at the historic Chaugan heritage bazaar.'
    },
    startingPrice: 10999,
    popularActivities: ['Khajjiar Glider Flight & Zorbing', 'Chamba Rumal Heritage Craft Workshop', 'Chamera Lake Speedboating', 'Bharmour Chaurasi Temple Exploration', 'Saach Pass 4x4 Mountain Safari']
  }
];

export const CURATED_STAYS: Stay[] = [
  {
    id: 'stay-test-1788667475801',
    name: 'Pahadi Pine Loft & Apple Orchard Chalet',
    location: 'Old Manali High Ridge',
    destinationId: 'manali',
    type: 'Boutique Homestay',
    pricePerNight: 4500,
    rating: 4.96,
    reviewsCount: 84,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      'Geothermal Heated Water',
      'High-Speed Starlink Wifi',
      'Wood Fireplace',
      'Panoramic Snow Views',
      'Organic Apple Orchard Walk'
    ],
    creatorNote: 'Hand-crafted cedar wood loft situated in heritage apple orchard with 360-degree snow peaks view.',
    isHandpicked: true,
    description: 'Hand-crafted cedar wood loft situated in heritage apple orchard.'
  },
  {
    id: 'stay-1',
    name: 'The Cedar Nest Geodesic Luxury Dome',
    location: 'Old Manali Ridge, Manali',
    destinationId: 'manali',
    type: 'Luxury Glamping',
    pricePerNight: 5800,
    rating: 4.95,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Panoramic Valley View', 'Pellet Fireplace', 'Heated Bedding', 'Stargazing Skylight', 'High Speed Starlink WiFi'],
    creatorNote: 'I stayed here during December snowfall. Watching the snowflakes land on the glass ceiling while sipping hot spiced apple cider is pure magic.',
    isHandpicked: true
  },
  {
    id: 'stay-2',
    name: 'Kaza Mud & Stone Solar Haven',
    location: 'Rangrik Valley, Spiti',
    destinationId: 'spiti',
    type: 'Boutique Homestay',
    pricePerNight: 4200,
    rating: 4.9,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Passive Solar Architecture', 'Traditional Bukhari Stove', 'Organic Spiti Thali', 'Telescope Access', 'Oxygen Concentrator On-site'],
    creatorNote: 'Run by my dear friend Tenzin. 100% warm even when temperatures drop to -15°C outside in winter.',
    isHandpicked: true
  },
  {
    id: 'stay-3',
    name: 'Dhauladhar Mist Heritage Cottage',
    location: 'Dharamkot, Dharamshala',
    destinationId: 'dharamshala',
    type: 'Mountain Villa',
    pricePerNight: 6500,
    rating: 4.88,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Private Balcony facing Triund', 'Stone Fireplace', 'Herbal Tea Garden', 'Yoga Deck', 'Pet Friendly'],
    creatorNote: 'The morning mist clears right around 7:30 AM to reveal the snow peaks. Perfect for creators and remote workers.',
    isHandpicked: true
  },
  {
    id: 'stay-4',
    name: 'Mashobra Whispering Pines Estate',
    location: 'Mashobra, Shimla',
    destinationId: 'shimla',
    type: 'Heritage Haveli',
    pricePerNight: 7200,
    rating: 4.92,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Colonial Teak Wood Library', 'Bonfire Pit', 'Apple Orchard Walk', 'Personal Chef for Himachali Dham', 'Outdoor Jacuzzi'],
    creatorNote: 'Built in 1912 with preserved British-Indian architecture. Far from Shimla town crowds with private forest trails.',
    isHandpicked: true
  },
  {
    id: 'stay-5',
    name: 'Khajjiar Deodar Alpine Swiss Chalet',
    location: 'Khajjiar Meadow Edge, Chamba',
    destinationId: 'chamba',
    type: 'Luxury Glamping',
    pricePerNight: 6200,
    rating: 4.94,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Direct Meadow Frontage', 'Pinewood Fireplace', 'Heated Feather Duvets', 'Private Balcony looking at Pir Panjal', 'Authentic Chamba Madra Dining'],
    creatorNote: 'Waking up to wild horses grazing on the dew-kissed Khajjiar meadow surrounded by dense century-old deodar trees is unforgettable.',
    isHandpicked: true
  }
];

export const LOCAL_GUIDES: LocalGuide[] = [
  {
    id: 'guide-1',
    name: 'Karam Chand Thakur',
    nickname: 'The Manali Mountain Wolf',
    destination: 'Manali & Kullu Valley',
    experienceYears: 14,
    languages: ['Hindi', 'Pahadi (Kulluvi)', 'English'],
    specialty: 'High-Altitude Pass Crossings, Hidden Waterfalls, Safe Off-roading',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Born in Vashisht village, Karam has led over 300 successful mountain expeditions across Rohtang, Bhrigu Lake, and Pin Parvati pass.',
    badge: 'Certified Mountaineer (ABVIMAS)'
  },
  {
    id: 'guide-2',
    name: 'Tenzin Norbu',
    nickname: 'Spiti Astro Master',
    destination: 'Spiti & Kaza',
    experienceYears: 9,
    languages: ['Tibetan / Bhoti', 'Hindi', 'English'],
    specialty: 'Monastery Secret Lore, Dark Sky Stargazing, Winter Snow Leopard Tracking',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Tenzin knows every monk, homestay elder, and fossil trail between Tabo and Losar. His father was a lama at Key Gompa.',
    badge: 'Local Heritage Custodian'
  },
  {
    id: 'guide-3',
    name: 'Pema Dolma',
    nickname: 'Kangra Tea & Culture Maven',
    destination: 'Dharamshala & Kangra',
    experienceYears: 7,
    languages: ['English', 'Tibetan', 'Hindi', 'Pahadi'],
    specialty: 'Tibetan Healing Traditions, Triund Ridge Navigation, Cultural Immersion',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Pema brings stories of Tibetan exile heritage alive while guiding peaceful walks through rhododendron paths and tea estates.',
    badge: 'Eco-Tourism Specialist'
  },
  {
    id: 'guide-4',
    name: 'Sunil Sharma',
    nickname: 'The Ravi Valley Chronicler',
    destination: 'Chamba, Khajjiar & Bharmour',
    experienceYears: 12,
    languages: ['Hindi', 'Pahadi (Chambyali)', 'Punjabi', 'English'],
    specialty: '10th-Century Temple Iconography, Saach Pass 4x4 Navigation, Chamba Rumal History',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    bio: 'A native of Chamba Chaugan, Sunil is an authority on the ancient Chaurasi temples of Bharmour, Manimahesh pilgrimage lore, and high-altitude trails to Pangi.',
    badge: 'Heritage & High Pass Specialist'
  }
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-spiti-ultimate',
    title: 'The Legendary Spiti & Kaza Circuit',
    destination: 'Spiti Valley, Kaza & Atal Tunnel',
    destinationId: 'spiti',
    duration: '6 Days / 5 Nights',
    basePrice: 26999,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    badge: 'Most Booked • Creator Special',
    overview: 'An epic high-altitude road journey through ancient gompas, world-record post offices, high suspension bridges, and starry cold desert nights.',
    highlights: [
      'Private 4x4 Himalayan Scorpio/Thar transit',
      'Stargazing masterclass at Langza Fossil Ridge',
      'Exclusive prayer ceremony with Key Monastery lamas',
      'Chicham Bridge & Hikkim highest post office card sending',
      'Handpicked Solar Homestays with warm bukhari stoves'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Manali to Kaza via Atal Tunnel & Kunzum Pass',
        description: 'Cross the engineering marvel Atal Tunnel, descend into Chandra Valley, drive alongside glacier rivers, and ascend the holy Kunzum Pass (4,551m).',
        stayOption: {
          standard: 'Cozy Kaza Riverview Homestay',
          luxuryUpgrade: 'Kaza Mud & Stone Solar Haven',
          upgradeCost: 2200
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-1-1', name: 'Kunzum Stupa Prayer Flag Ceremony', cost: 0, included: true, selected: true },
          { id: 'act-1-2', name: 'Riverside Seabuckthorn Tea Welcome', cost: 0, included: true, selected: true },
          { id: 'act-1-3', name: 'High Altitude Acclimatization Kit & Oximeter Check', cost: 0, included: true, selected: true }
        ]
      },
      {
        dayNumber: 2,
        title: '1,000-Year Key Monastery & Chicham Gorge',
        description: 'Ascend to the breathtaking Key Gompa for morning butter tea with monks, then stand atop Asia highest suspension bridge at Chicham.',
        stayOption: {
          standard: 'Cozy Kaza Riverview Homestay',
          luxuryUpgrade: 'Kaza Mud & Stone Solar Haven',
          upgradeCost: 2200
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-2-1', name: 'Private Key Monastery Monk Tour', cost: 0, included: true, selected: true },
          { id: 'act-2-2', name: 'Chicham Gorge Zip-line Experience', cost: 1500, included: false, selected: false },
          { id: 'act-2-3', name: 'Kibber Wildlife Sanctuary Snow Leopard Trail Walk', cost: 1200, included: false, selected: false }
        ]
      },
      {
        dayNumber: 3,
        title: 'The High Villages: Hikkim, Komic & Langza',
        description: 'Send a handwritten postcard from Hikkim (world highest post office), visit Tangyud Monastery at Komic, and gaze at Buddha statue in Langza.',
        stayOption: {
          standard: 'Langza Traditional Mud Home',
          luxuryUpgrade: 'Langza Astro Stargazing Dome',
          upgradeCost: 3500
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-3-1', name: 'Hikkim Postcard Souvenir Pack (10 Custom Stamps)', cost: 500, included: true, selected: true },
          { id: 'act-3-2', name: 'Langza Tethys Marine Fossil Guided Hunt', cost: 800, included: true, selected: true },
          { id: 'act-3-3', name: 'Night Milky Way Astrophotography Session with Tenzin', cost: 2000, included: false, selected: true }
        ]
      },
      {
        dayNumber: 4,
        title: 'Pin Valley National Park & Dhankar Monastery',
        description: 'Explore the green oasis of Mudh village in Pin Valley and climb to the sheer cliff-edge fortress monastery of Dhankar overlooking river confluence.',
        stayOption: {
          standard: 'Tabo Heritage Monastery Lodge',
          luxuryUpgrade: 'Pin River Glamping Haven',
          upgradeCost: 2800
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-4-1', name: 'Dhankar Lake 1-Hour Alpine Ridge Hike', cost: 0, included: true, selected: true },
          { id: 'act-4-2', name: 'Authentic Tibetan Butter Lamp Lighting', cost: 600, included: false, selected: false },
          { id: 'act-4-3', name: 'Local Chamurthi Mountain Pony Ride', cost: 1400, included: false, selected: false }
        ]
      },
      {
        dayNumber: 5,
        title: 'Chandratal: The Crescent Moon Lake',
        description: 'Drive towards the emerald glacial lake of Chandratal (4,300m) situated between high scree mountains. Witness the water shifting colors under the sun.',
        stayOption: {
          standard: 'Chandratal Alpine Meadow Camp',
          luxuryUpgrade: 'Luxury Swiss Heated Tent with Washroom',
          upgradeCost: 3200
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-5-1', name: 'Sunset Lake Parikrama Walk', cost: 0, included: true, selected: true },
          { id: 'act-5-2', name: 'Bonfire & Himachali Folk Tale Storytelling', cost: 0, included: true, selected: true }
        ]
      },
      {
        dayNumber: 6,
        title: 'Chandratal to Manali Farewell',
        description: 'Morning drive over Rohtang Pass / Atal Tunnel route, arriving in Manali with memories for a lifetime and custom Nomad goodie bag.',
        stayOption: {
          standard: 'Departure to Delhi / Chandigarh Volvo',
          luxuryUpgrade: 'Night Stay at Cedar Glamping Dome Manali',
          upgradeCost: 4500
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-6-1', name: 'Creator Farewell Lunch & Siddu Tasting in Old Manali', cost: 0, included: true, selected: true },
          { id: 'act-6-2', name: 'Exclusive Nomad Travel Bag & Organic Spiti Honey Jar', cost: 0, included: true, selected: true }
        ]
      }
    ]
  },
  {
    id: 'pkg-manali-slow',
    title: 'Manali Slow Living, Glamping & Secret Waterfalls',
    destination: 'Old Manali, Sethan & Sissu Valley',
    destinationId: 'manali',
    duration: '4 Days / 3 Nights',
    basePrice: 14499,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    badge: 'Creator Handcrafted',
    overview: 'Experience Manali like a true local: boutique cafe crawls, secret pine meadow hikes, Igloo & Glamping domes in Sethan, and waterfall picnics in Sissu.',
    highlights: [
      'Stay in luxury heated geodesic domes overlooking pine valleys',
      'Hidden Majach Village trail picnic with live camp stove chai',
      'Tandem paragliding flight with 4K GoPro footage included',
      'Sissu Lahaul Day Trip through Atal Tunnel with traditional Thukpa lunch'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Manali & Old Town Cafe Crawl',
        description: 'Check into your cedar haven, unwind, and embark on a curated afternoon walk exploring wood-and-stone Kathkuni houses and hidden cafes.',
        stayOption: {
          standard: 'Old Manali Pine Chalet',
          luxuryUpgrade: 'The Cedar Nest Geodesic Luxury Dome',
          upgradeCost: 3200
        },
        selectedStay: 'luxury',
        activities: [
          { id: 'act-m1-1', name: 'Old Manali Apple Cider & Bakery Tour', cost: 0, included: true, selected: true },
          { id: 'act-m1-2', name: 'Sunset at Manu Temple Overlook', cost: 0, included: true, selected: true }
        ]
      },
      {
        dayNumber: 2,
        title: 'Jogini Waterfall Secret Trail & Solang Paragliding',
        description: 'Trek past ancient deodar trees to upper Jogini falls, followed by an exhilarating paragliding flight over Solang Valley.',
        stayOption: {
          standard: 'Old Manali Pine Chalet',
          luxuryUpgrade: 'The Cedar Nest Geodesic Luxury Dome',
          upgradeCost: 3200
        },
        selectedStay: 'luxury',
        activities: [
          { id: 'act-m2-1', name: 'High Fly Paragliding with 4K GoPro Capture', cost: 3200, included: true, selected: true },
          { id: 'act-m2-2', name: 'Upper Jogini Waterfall Riverside Picnic Basket', cost: 800, included: true, selected: true },
          { id: 'act-m2-3', name: 'Evening Herbal Spa & Cedar Wood Sauna', cost: 2200, included: false, selected: false }
        ]
      },
      {
        dayNumber: 3,
        title: 'Sethan Hampta Valley 4x4 & Stargazing',
        description: 'Drive up the 35 hairpin curves to Buddhist tribal village of Sethan. Walk in snowfields or apple orchards, with evening barbecue by the bonfire.',
        stayOption: {
          standard: 'Sethan Village Wooden Cottage',
          luxuryUpgrade: 'Sethan Igloo / Geodesic Dome Suite',
          upgradeCost: 4000
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-m3-1', name: 'Sethan Off-Road 4x4 Thar Drive', cost: 1800, included: true, selected: true },
          { id: 'act-m3-2', name: 'Night Bonfire with Trout Fish / Grilled Paneer Barbecue', cost: 1200, included: true, selected: true }
        ]
      },
      {
        dayNumber: 4,
        title: 'Sissu Valley Expedition & Departure',
        description: 'Cross the Atal Tunnel into Lahaul to witness the majestic Sissu Waterfall and willow-lined riverbanks before evening Volvo departure.',
        stayOption: {
          standard: 'Evening Volvo Departure to Delhi',
          luxuryUpgrade: 'Extra Night with Private Driver',
          upgradeCost: 2900
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-m4-1', name: 'Sissu Glacier Lake Walk & Thukpa Lunch', cost: 0, included: true, selected: true },
          { id: 'act-m4-2', name: 'Local Kullu Shawl & Apple Jam Hamper', cost: 0, included: true, selected: true }
        ]
      }
    ]
  },
  {
    id: 'pkg-dharamshala-zen',
    title: 'Dharamshala, Triund & Kangra Soul Retreat',
    destination: 'McLeodGanj, Triund & Dharamkot',
    destinationId: 'dharamshala',
    duration: '4 Days / 3 Nights',
    basePrice: 11999,
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
    badge: 'Wellness & Trekking',
    overview: 'Rejuvenate your soul with Tibetan bowl sound healing, guided Triund ridge trek with 360-degree Dhauladhar peaks, and Kangra valley tea tasting.',
    highlights: [
      'Overnight camping atop Triund ridge under the starry Milky Way',
      'Private Tibetan singing bowl meditation with a Buddhist practitioner',
      'Guided art tour of Norbulingka Institute and Thangka painters',
      'Traditional Kangra Valley organic tea garden tasting tour'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'McLeodGanj Dalai Lama Temple & Sound Healing',
        description: 'Arrive in the serene hills of Dharamkot. Visit the Tsuglagkhang complex and experience a 60-minute sound bath meditation.',
        stayOption: {
          standard: 'Dharamkot Bohemian Eco Lodge',
          luxuryUpgrade: 'Dhauladhar Mist Heritage Cottage',
          upgradeCost: 2600
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-d1-1', name: 'Singing Bowl Tibetan Sound Healing Session', cost: 1200, included: true, selected: true },
          { id: 'act-d1-2', name: 'Guided Dalai Lama Temple Walk & Kora', cost: 0, included: true, selected: true }
        ]
      },
      {
        dayNumber: 2,
        title: 'The Great Triund Ridge Trek & High Camp',
        description: 'Trek through oak and rhododendron forests up to 2,875m Triund top. Watch the sunset turn the Dhauladhar wall into molten gold.',
        stayOption: {
          standard: 'Triund Alpine Summit Dome Tent with Sleeping Bag',
          luxuryUpgrade: 'VIP Insulated 4-Season Tent with Private Chef',
          upgradeCost: 2000
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-d2-1', name: 'Certified Mountain Guide & Luggage Porter', cost: 0, included: true, selected: true },
          { id: 'act-d2-2', name: 'High Altitude Dal-Bhat & Hot Chai Summit Dinner', cost: 0, included: true, selected: true }
        ]
      },
      {
        dayNumber: 3,
        title: 'Descend to Gallu Waterfall & Norbulingka',
        description: 'Gentle morning descent via the secret Gallu waterfall stream pool. Afternoon visit to the preserved Tibetan arts of Norbulingka.',
        stayOption: {
          standard: 'Dharamkot Bohemian Eco Lodge',
          luxuryUpgrade: 'Dhauladhar Mist Heritage Cottage',
          upgradeCost: 2600
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-d3-1', name: 'Gallu Waterfall Glacial Dip & Fresh Maggi', cost: 0, included: true, selected: true },
          { id: 'act-d3-2', name: 'Thangka Painting & Wood Carving Workshop Pass', cost: 950, included: true, selected: true }
        ]
      },
      {
        dayNumber: 4,
        title: 'Kangra Tea Estate Tour & Farewell',
        description: 'Stroll through 150-year-old heritage tea gardens in Palampur / Dharamshala, sample freshly picked orthodox black and green teas before travel.',
        stayOption: {
          standard: 'Departure to Delhi / Pathankot',
          luxuryUpgrade: 'Extra Night in Tea Bungalow',
          upgradeCost: 3500
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-d4-1', name: 'Kangra Organic Tea Tasting Masterclass', cost: 0, included: true, selected: true },
          { id: 'act-d4-2', name: 'Tin of Single-Estate Kangra Tea to take home', cost: 0, included: true, selected: true }
        ]
      }
    ]
  },
  {
    id: 'pkg-chamba-heritage',
    title: 'Chamba Royal Heritage, Khajjiar & Mini Switzerland Circuit',
    destination: 'Chamba, Khajjiar & Bharmour Valley',
    destinationId: 'chamba',
    duration: '5 Days / 4 Nights',
    basePrice: 16499,
    image: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80',
    badge: 'Royal Heritage & Meadow Special',
    overview: 'Immerse yourself in 1,000 years of unbroken Himalayan royalty: explore the stone temples of Chamba, walk through the deodar glades of Khajjiar (Mini Switzerland), speed-boat across emerald Chamera Lake, and visit ancient Bharmour.',
    highlights: [
      'Stay in alpine chalets overlooking the green Khajjiar meadow',
      'Private 10th-century Laxmi Narayan Temple heritage tour with priest blessings',
      'Exclusive Chamba Rumal silk embroidery masterclass at Chaugan craft guild',
      'Speed-boating across emerald Chamera Lake nestled in high gorges',
      'Traditional Chamba Dham feast with slow-cooked Madra, Rajma, and spicy Chukh'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Chamba Town & 10th-Century Temple Complex',
        description: 'Check in by the Ravi River. Afternoon guided heritage walk to the 10th-century Laxmi Narayan Shikhara temples and Bhuri Singh Museum.',
        stayOption: {
          standard: 'Chamba Riverside Heritage Inn',
          luxuryUpgrade: 'Chamba Ravi River Heritage Haveli',
          upgradeCost: 2400
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-ch1-1', name: 'Laxmi Narayan Temple Heritage Walk with Priest Guide', cost: 0, included: true, selected: true },
          { id: 'act-ch1-2', name: 'Bhuri Singh Royal Miniature Paintings Tour', cost: 400, included: true, selected: true },
          { id: 'act-ch1-3', name: 'Traditional Chamba Dham Welcome Dinner (Madra & Chukh)', cost: 0, included: true, selected: true }
        ]
      },
      {
        dayNumber: 2,
        title: 'Khajjiar: The Mini Switzerland of India',
        description: 'Ascend through dense cedar and pine forests to Khajjiar. Walk on the floating grass island, try paragliding/zorbing, and relax by the emerald lake.',
        stayOption: {
          standard: 'Khajjiar Pine Meadow Lodge',
          luxuryUpgrade: 'Khajjiar Deodar Alpine Swiss Chalet',
          upgradeCost: 3200
        },
        selectedStay: 'luxury',
        activities: [
          { id: 'act-ch2-1', name: 'Khajjiar Glider Flight & Zorbing Experience', cost: 1800, included: true, selected: true },
          { id: 'act-ch2-2', name: 'Deodar Canopy Forest Nature Trail', cost: 0, included: true, selected: true },
          { id: 'act-ch2-3', name: 'Bonfire & Roasted Pahadi Corn by the Meadow', cost: 0, included: true, selected: true }
        ]
      },
      {
        dayNumber: 3,
        title: 'Kalatop Wildlife Sanctuary & Dalhousie Panoramas',
        description: 'Trek the Pohani Dhar ridge inside Kalatop sanctuary with panoramic views of Pir Panjal peaks, followed by colonial heritage walks in Dalhousie.',
        stayOption: {
          standard: 'Khajjiar Pine Meadow Lodge',
          luxuryUpgrade: 'Khajjiar Deodar Alpine Swiss Chalet',
          upgradeCost: 3200
        },
        selectedStay: 'luxury',
        activities: [
          { id: 'act-ch3-1', name: 'Kalatop Wildlife Sanctuary Guided Forest Walk', cost: 600, included: true, selected: true },
          { id: 'act-ch3-2', name: 'Pohani Dhar Sunset Tea Picnic Basket', cost: 800, included: true, selected: true }
        ]
      },
      {
        dayNumber: 4,
        title: 'Bharmour Chaurasi 84-Temple Complex & Sacred Lore',
        description: 'Drive along the deep Budhil canyon to the ancient 6th-century capital of Bharmour. Visit the sacred Chaurasi temple courtyard under the shadow of Manimahesh Kailash.',
        stayOption: {
          standard: 'Chamba Riverside Heritage Inn',
          luxuryUpgrade: 'Chamba Ravi River Heritage Haveli',
          upgradeCost: 2400
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-ch4-1', name: 'Chaurasi 84-Temple Complex Cultural Tour', cost: 0, included: true, selected: true },
          { id: 'act-ch4-2', name: 'Chamba Rumal Double-Sided Silk Embroidery Workshop', cost: 950, included: false, selected: true }
        ]
      },
      {
        dayNumber: 5,
        title: 'Chamera Emerald Lake Speedboat & Farewell',
        description: 'Enjoy a thrilling speedboat ride across the turquoise waters of Chamera Lake before heading towards Pathankot / Delhi.',
        stayOption: {
          standard: 'Departure to Pathankot / Delhi',
          luxuryUpgrade: 'Extra Night in Chamera Lakeview Suite',
          upgradeCost: 3800
        },
        selectedStay: 'standard',
        activities: [
          { id: 'act-ch5-1', name: 'Chamera Lake Private Speedboat Cruise', cost: 1200, included: true, selected: true },
          { id: 'act-ch5-2', name: 'Artisan Bottle of Chamba Chukh & Traditional Souvenir', cost: 0, included: true, selected: true }
        ]
      }
    ]
  }
];

export const REEL_POSTS: ReelPost[] = [
  {
    id: 'reel-1',
    authorName: 'Monu (The Nomad)',
    authorHandle: '@travelmonu',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isCreator: true,
    isVerifiedTraveler: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flying-over-snow-capped-mountains-41566-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    caption: 'Current live update from Rohtang Pass & Atal Tunnel! Clear blue skies, -1°C, roads completely dry and open. Book the weekend Spiti pass now! 🏔️✨ #SpitiValley #Manali #CreatorGuide',
    location: 'Spiti Valley & Rohtang',
    destinationId: 'spiti',
    likes: 3840,
    commentsCount: 142,
    datePosted: '2 hours ago',
    audioTrack: 'Traditional Himachali Flute & Acoustic Beat',
    liveUpdateStatus: 'Live Road Status: All Open • Clear Weather'
  },
  {
    id: 'reel-chamba',
    authorName: 'Monu (The Nomad)',
    authorHandle: '@travelmonu',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isCreator: true,
    isVerifiedTraveler: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pine-trees-covered-with-snow-in-a-forest-42512-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80',
    caption: 'Standing in the middle of Khajjiar meadow surrounded by giant deodars with Pir Panjal in the background! Chamba is Himachal’s greatest hidden royal valley. 🌲✨ #Khajjiar #Chamba #MiniSwitzerland',
    location: 'Chamba & Khajjiar',
    destinationId: 'chamba',
    likes: 2490,
    commentsCount: 98,
    datePosted: '5 hours ago',
    audioTrack: 'Chambyali Pahadi Folk Acoustic',
    liveUpdateStatus: 'Khajjiar Meadow Open • Clear Road'
  },
  {
    id: 'reel-2',
    authorName: 'Sneha & Rohan',
    authorHandle: '@wander.two',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    isCreator: false,
    isVerifiedTraveler: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-mountain-peaks-41563-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    caption: 'We swapped our hotel for the Cedar Geodesic Dome in Old Manali using @travelmonu package customizer. Waking up to this 360-degree snow view was the best decision ever! ☕❄️',
    location: 'Old Manali Geodesic Dome',
    destinationId: 'manali',
    likes: 2190,
    commentsCount: 88,
    datePosted: 'Yesterday',
    audioTrack: 'Pahadi Morning Chill Lo-Fi'
  },
  {
    id: 'reel-3',
    authorName: 'Tenzin (Local Guide)',
    authorHandle: '@spiti_tenzin',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isCreator: false,
    isVerifiedTraveler: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-himalayan-valley-41568-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80',
    caption: 'Morning prayers echoing across 1000-year-old Key Gompa. If you are joining my group next week, don’t forget to pack thermal base layers! See you in Kaza! 🙏',
    location: 'Key Monastery, Kaza',
    destinationId: 'kaza',
    likes: 1840,
    commentsCount: 65,
    datePosted: '2 days ago',
    audioTrack: 'Tibetan Monk Chants & Wind Chimes',
    liveUpdateStatus: 'Spiti Local Guide Verified'
  },
  {
    id: 'reel-4',
    authorName: 'Priya Sharma',
    authorHandle: '@priyainthehills',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    isCreator: false,
    isVerifiedTraveler: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fog-over-the-mountain-forest-41565-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80',
    caption: 'Trek to Triund with Pema as our guide! Reached the top just in time for this magical sunset over the Dhauladhar range. Highly recommend booking via this site!',
    location: 'Triund Ridge, McLeodGanj',
    destinationId: 'dharamshala',
    likes: 3120,
    commentsCount: 97,
    datePosted: '3 days ago',
    audioTrack: 'Acoustic Folk Strings'
  }
];

export const TRANSIT_OPTIONS: TransitOption[] = [
  {
    id: 'volvo-1',
    type: 'bus',
    operator: 'Himachal Nomad Premier Sleeper Volvo 9600',
    route: 'Delhi (Kashmere Gate) → Manali (Private Lounge)',
    departureTime: '06:30 PM',
    arrivalTime: '07:30 AM (+1 Day)',
    duration: '13h 00m',
    price: 1850,
    rating: 4.9,
    amenities: ['Individual 4K Entertainment Screens', 'Deep Recline Heated Sleepers', 'Complimentary Spiced Chai & Snack Box', 'Clean Blanket & Pillow', 'WiFi & Charging'],
    badge: 'Creator Recommended'
  },
  {
    id: 'volvo-2',
    type: 'bus',
    operator: 'HRTC Himsuta Luxury Gold Volvo',
    route: 'Chandigarh (ISBT 43) → Manali Mall Road',
    departureTime: '09:00 PM',
    arrivalTime: '05:30 AM (+1 Day)',
    duration: '8h 30m',
    price: 1250,
    rating: 4.7,
    amenities: ['Semi-Sleeper AC', 'Water Bottle', 'Night Halt at Clean Diner', 'Experienced Mountain Driver'],
    badge: 'Fastest Highway Transit'
  },
  {
    id: 'volvo-3',
    type: 'bus',
    operator: 'Spiti 4x4 High-Pass Safari Cruiser',
    route: 'Manali (Old Town) → Kaza (Spiti Gateway)',
    departureTime: '05:00 AM',
    arrivalTime: '02:30 PM',
    duration: '9h 30m',
    price: 2600,
    rating: 4.95,
    amenities: ['Max 4 Travelers per 4x4 Thar/Scorpio', 'Oximeter & Oxygen Cylinder onboard', 'Chhatru Glacier Breakfast Stop', 'Kunzum Pass Photo Halt'],
    badge: 'Adventure High Transit'
  },
  {
    id: 'flight-1',
    type: 'flight',
    operator: 'Alliance Air (ATR-72)',
    route: 'Delhi (DEL T3) → Kullu-Manali (KUU Bhuntar)',
    departureTime: '07:15 AM',
    arrivalTime: '08:45 AM',
    duration: '1h 30m',
    price: 6499,
    rating: 4.8,
    amenities: ['Scenic Himalayan Mountain Window View', '15kg Check-in + 7kg Cabin', 'Priority Bhuntar Airport Private Taxi Connect'],
    badge: 'Fastest 90-Min Reach'
  },
  {
    id: 'flight-2',
    type: 'flight',
    operator: 'SpiceJet Mountain Shuttle',
    route: 'Delhi (DEL T2) → Dharamshala (DHM Gaggal)',
    departureTime: '09:40 AM',
    arrivalTime: '11:10 AM',
    duration: '1h 30m',
    price: 5299,
    rating: 4.6,
    amenities: ['Direct Flight', 'Spectacular Dhauladhar View on Left', 'Free Rescheduling on Weather Alerts'],
    badge: 'Dharamshala Direct'
  }
];

export const INITIAL_CUSTOM_REQUESTS: CustomTripRequest[] = [];

