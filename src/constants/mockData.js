import siomaiRiceImg from '../assets/steamed_pork_siomai_rice.png';
import lugawWithEggImg from '../assets/special_lugaw_with_egg.png';
import sizzlingBurgerSteakImg from '../assets/sizzling_burger_steak.png';
import crispyChickenRiceImg from '../assets/crispy_chicken_rice.png';
import dimsumTreatsStallImg from '../assets/dimsum_treats_stall.png';
import creamyCarbonaraImg from '../assets/creamy_carbonara.png';
import kwekKwekPlatterImg from '../assets/kwek_kwek_platter.png';
import icedMilkTeaImg from '../assets/iced_milk_tea.png';
import cheeseRollsImg from '../assets/cheese_rolls.png';

export const FOOD_STALLS = [
  {
    id: 'ang-kong',
    name: 'Angkong Dimsum House',
    description: 'The ultimate student favorite for delicious, ' +
                 'affordable siomai rice with sweet chili sauce.',
    campusId: 'ust',
    distance: '3 mins walk',
    distanceMeters: 180,
    categories: ['Rice Meals', 'Snacks & Street Food'],
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d' +
           '?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 142,
    googleMapsUrl: 'https://maps.google.com/?q=Angkong+Dimsum+House+P.+Noval+UST',
    openingHours: '9:00 AM - 8:00 PM',
    menuItemIds: [
      'angkong-siomai-pork',
      'angkong-siomai-chicken',
      'angkong-dumplings'
    ]
  },
  {
    id: 'ate-ricas',
    name: "Ate Rica's Bacsilog",
    description: 'Famous bacsilog loaded with cheese sauce, ' +
                 'liquid seasoning, and crunchy bacon bits.',
    campusId: 'ust',
    distance: '2 mins walk',
    distanceMeters: 120,
    categories: ['Rice Meals'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8' +
           '?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 98,
    googleMapsUrl: 'https://maps.google.com/?q=Ate+Ricas+Bacsilog+Asturias+UST',
    openingHours: '7:00 AM - 9:00 PM',
    menuItemIds: [
      'ate-ricas-bacon',
      'ate-ricas-tapa',
      'ate-ricas-combo'
    ]
  },
  {
    id: 'dimsum-treats',
    name: 'Dimsum Treats',
    description: 'Generous servings of steam/fried dimsum and ' +
                 'larger-than-average siomai at budget rates.',
    campusId: 'ust',
    distance: '5 mins walk',
    distanceMeters: 300,
    categories: ['Rice Meals', 'Snacks & Street Food'],
    image: dimsumTreatsStallImg,
    rating: 4.5,
    reviewsCount: 84,
    googleMapsUrl: 'https://maps.google.com/?q=Dimsum+Treats+Dapitan+UST',
    openingHours: '8:00 AM - 10:00 PM',
    menuItemIds: [
      'dimsum-siomai-rice',
      'dimsum-sharkfin-rice'
    ]
  },
  {
    id: 'hepaslane-burgers',
    name: 'Hepaslane Street Grill',
    description: 'Affordable flame-grilled burgers, footlong hotdogs, ' +
                 'and street skewers right outside the gate.',
    campusId: 'feu',
    distance: '1 min walk',
    distanceMeters: 50,
    categories: ['Sandwiches & Bakery', 'Snacks & Street Food'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' +
           '?w=600&auto=format&fit=crop&q=80',
    rating: 4.2,
    reviewsCount: 56,
    googleMapsUrl: 'https://maps.google.com/?q=Gastambide+Street+FEU+Manila',
    openingHours: '10:00 AM - 11:00 PM',
    menuItemIds: [
      'hepaslane-burger-cheese',
      'hepaslane-footlong'
    ]
  },
  {
    id: 'lola-elenas',
    name: "Lola Elena's Pancit & Lugawan",
    description: 'Hearty bowls of lugaw, tokwa’t baboy, and loaded ' +
                 'pancit cantoon, cooked home-style.',
    campusId: 'feu',
    distance: '4 mins walk',
    distanceMeters: 250,
    categories: ['Noodles/Pasta', 'Snacks & Street Food'],
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246' +
           '?w=600&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewsCount: 37,
    googleMapsUrl: 'https://maps.google.com/?q=Nicanor+Reyes+FEU+Manila',
    openingHours: '6:00 AM - 8:00 PM',
    menuItemIds: [
      'lola-elena-lugaw',
      'lola-elena-pancit'
    ]
  },
  {
    id: 'mendiola-siomai',
    name: 'Mendiola Siomai & Fried Rice',
    description: 'Classic student station on Mendiola Bridge ' +
                 'for quick, steaming hot siomai packs.',
    campusId: 'ceu',
    distance: '2 mins walk',
    distanceMeters: 100,
    categories: ['Rice Meals', 'Snacks & Street Food'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb' +
           '?w=600&auto=format&fit=crop&q=80',
    rating: 4.3,
    reviewsCount: 63,
    googleMapsUrl: 'https://maps.google.com/?q=Mendiola+Street+Manila',
    openingHours: '7:30 AM - 7:30 PM',
    menuItemIds: [
      'mendiola-siomai-rice-combo',
      'mendiola-gulaman'
    ]
  },
  {
    id: 'beda-diners',
    name: 'Beda Red Diners',
    description: 'Cozy cafeteria annex serving sizzling pork sisig ' +
                 'and garlic fried rice to San Beda students.',
    campusId: 'sanbeda',
    distance: '3 mins walk',
    distanceMeters: 150,
    categories: ['Rice Meals'],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19' +
           '?w=600&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewsCount: 49,
    googleMapsUrl: 'https://maps.google.com/?q=San+Beda+University+Mendiola+Manila',
    openingHours: '8:00 AM - 6:00 PM',
    menuItemIds: [
      'beda-red-sisig',
      'beda-red-chix'
    ]
  },
  {
    id: 'ue-sizzling',
    name: 'Gastambide Sizzling & Grill',
    description: 'Popular among UE Warriors for affordable sizzling ' +
                 'plates with unlimited gravy.',
    campusId: 'ue',
    distance: '3 mins walk',
    distanceMeters: 180,
    categories: ['Rice Meals'],
    image: sizzlingBurgerSteakImg,
    rating: 4.5,
    reviewsCount: 42,
    googleMapsUrl: 'https://maps.google.com/?q=Gastambide+Street+UE+Manila',
    openingHours: '9:00 AM - 9:00 PM',
    menuItemIds: ['ue-burger-steak']
  },
  {
    id: 'nu-chicken',
    name: 'Jhocson Crispy Chicken',
    description: 'Huge crispy chicken wings served with rich gravy ' +
                 'and java rice, a favorite of NU Bulldogs.',
    campusId: 'nu',
    distance: '2 mins walk',
    distanceMeters: 100,
    categories: ['Rice Meals'],
    image: crispyChickenRiceImg,
    rating: 4.6,
    reviewsCount: 57,
    googleMapsUrl: 'https://maps.google.com/?q=Jhocson+Street+NU+Manila',
    openingHours: '8:30 AM - 8:00 PM',
    menuItemIds: ['nu-chicken-rice']
  },
  {
    id: 'love-pasta',
    name: 'Love Pasta',
    description: 'Affordable, freshly cooked pasta dishes with ' +
                 'rich creamy carbonara and savory pesto.',
    campusId: 'ust',
    distance: '4 mins walk',
    distanceMeters: 220,
    categories: ['Noodles/Pasta'],
    image: creamyCarbonaraImg,
    rating: 4.7,
    reviewsCount: 88,
    googleMapsUrl: 'https://maps.google.com/?q=Love+Pasta+P.+Noval+UST',
    openingHours: '10:00 AM - 9:00 PM',
    menuItemIds: ['love-pasta-carbonara']
  },
  {
    id: 'feu-tusok',
    name: 'FEU Tusok-Tusok Station',
    description: 'Famous street food stand offering fresh kwek-kwek, ' +
                 'fishballs, and local sauces.',
    campusId: 'feu',
    distance: '2 mins walk',
    distanceMeters: 100,
    categories: ['Snacks & Street Food'],
    image: kwekKwekPlatterImg,
    rating: 4.6,
    reviewsCount: 112,
    googleMapsUrl: 'https://maps.google.com/?q=Nicanor+Reyes+FEU+Manila',
    openingHours: '12:00 PM - 9:00 PM',
    menuItemIds: ['feu-kwek-kwek']
  },
  {
    id: 'd-cream',
    name: "D'Cream Coffee & Tea",
    description: 'Extremely popular student coffee and tea spot ' +
                 'serving high-quality milk tea and iced coffee.',
    campusId: 'ust',
    distance: '3 mins walk',
    distanceMeters: 150,
    categories: ['Drinks & Desserts'],
    image: icedMilkTeaImg,
    rating: 4.8,
    reviewsCount: 156,
    googleMapsUrl: 'https://maps.google.com/?q=DCream+Coffee+Tea+P.+Noval+UST',
    openingHours: '9:00 AM - 10:00 PM',
    menuItemIds: ['d-cream-milk-tea']
  },
  {
    id: 'tinapayan',
    name: 'Tinapayan Festival',
    description: 'Well-loved bakery famous for delicious cheese rolls, ' +
                 'sweet buns, and student-budget pastries.',
    campusId: 'ust',
    distance: '5 mins walk',
    distanceMeters: 300,
    categories: ['Sandwiches & Bakery'],
    image: cheeseRollsImg,
    rating: 4.9,
    reviewsCount: 204,
    googleMapsUrl: 'https://maps.google.com/?q=Tinapayan+Festival+Dapitan+UST',
    openingHours: '6:00 AM - 9:00 PM',
    menuItemIds: ['tinapayan-cheese-rolls']
  }
];

export const MEALS = [
  {
    id: 'angkong-siomai-pork',
    name: 'Pork Siomai Rice (4 pcs)',
    price: 55,
    description: 'Pork siomai topped with homemade chili garlic oil ' +
                 'and sweet soy sauce over a mountain of steaming rice.',
    stallId: 'ang-kong',
    stallName: 'Angkong Dimsum House',
    campusId: 'ust',
    category: 'Rice Meals',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 104,
    lastUpdated: '2026-06-28T12:00:00Z',
    tags: ['50-75']
  },
  {
    id: 'angkong-siomai-chicken',
    name: 'Chicken Siomai Rice (4 pcs)',
    price: 55,
    description: 'Tender chicken siomai with aromatic garlic sauce ' +
                 'and steamed white rice. A lighter delicious option.',
    stallId: 'ang-kong',
    stallName: 'Angkong Dimsum House',
    campusId: 'ust',
    category: 'Rice Meals',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 22,
    lastUpdated: '2026-06-29T10:30:00Z',
    tags: ['50-75']
  },
  {
    id: 'angkong-dumplings',
    name: 'Fried Dumplings Rice',
    price: 65,
    description: 'Crispy fried gyoza-style dumplings served with rice ' +
                 'and sweet-sour dynamic dipping sauce.',
    stallId: 'ang-kong',
    stallName: 'Angkong Dimsum House',
    campusId: 'ust',
    category: 'Rice Meals',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 16,
    lastUpdated: '2026-06-25T14:20:00Z',
    tags: ['50-75']
  },
  {
    id: 'ate-ricas-bacon',
    name: 'Bacon Bacsilog',
    price: 69,
    description: 'Crispy bacon strips, sunny-side-up egg, and famous ' +
                 'signature yellow cheese and liquid seasoning on garlic rice.',
    stallId: 'ate-ricas',
    stallName: "Ate Rica's Bacsilog",
    campusId: 'ust',
    category: 'Rice Meals',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 73,
    lastUpdated: '2026-06-30T09:15:00Z',
    tags: ['50-75']
  },
  {
    id: 'ate-ricas-tapa',
    name: 'Tapsilog (Beef Tapa)',
    price: 85,
    description: 'Premium marinated beef strips with a fried egg ' +
                 'and double-cheese sauce on garlic rice.',
    stallId: 'ate-ricas',
    stallName: "Ate Rica's Bacsilog",
    campusId: 'ust',
    category: 'Rice Meals',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewsCount: 20,
    lastUpdated: '2026-06-29T11:45:00Z',
    tags: ['75-100']
  },
  {
    id: 'ate-ricas-combo',
    name: 'Super Bacsilog Combo',
    price: 110,
    description: 'Ultimate loaded bacon, burger patty, hotdog combo ' +
                 'smothered in melted cheese sauce over garlic rice.',
    stallId: 'ate-ricas',
    stallName: "Ate Rica's Bacsilog",
    campusId: 'ust',
    category: 'Rice Meals',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewsCount: 5,
    lastUpdated: '2026-06-24T15:30:00Z',
    tags: ['above-100']
  },
  {
    id: 'dimsum-siomai-rice',
    name: 'Steamed Pork Siomai Rice',
    price: 49,
    description: '4 oversized pieces of savory pork siomai, garlic ' +
                 'bits, and plain rice. Ultimate budget-saver!',
    stallId: 'dimsum-treats',
    stallName: 'Dimsum Treats',
    campusId: 'ust',
    category: 'Rice Meals',
    image: siomaiRiceImg,
    rating: 4.6,
    reviewsCount: 65,
    lastUpdated: '2026-06-30T10:00:00Z',
    tags: ['under-50']
  },
  {
    id: 'dimsum-sharkfin-rice',
    name: 'Sharkfin Dumpling Rice',
    price: 52,
    description: 'Deliciously wrapped pork and seafood sharkfin ' +
                 'dumplings (4 pcs) served with sweet chili oil and rice.',
    stallId: 'dimsum-treats',
    stallName: 'Dimsum Treats',
    campusId: 'ust',
    category: 'Rice Meals',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewsCount: 19,
    lastUpdated: '2026-06-27T08:00:00Z',
    tags: ['50-75']
  },
  {
    id: 'hepaslane-burger-cheese',
    name: 'Double Cheese Street Burger',
    price: 45,
    description: 'Juicy local beef patty grill-fried, topped with ' +
                 'cheddar slices, fresh cabbage, and sweet dressing.',
    stallId: 'hepaslane-burgers',
    stallName: 'Hepaslane Street Grill',
    campusId: 'feu',
    category: 'Sandwiches & Bakery',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.3,
    reviewsCount: 42,
    lastUpdated: '2026-06-30T14:00:00Z',
    tags: ['under-50']
  },
  {
    id: 'hepaslane-footlong',
    name: 'Gastambide Footlong Hotdog',
    price: 70,
    description: 'A 12-inch grilled hotdog in a soft bun, loaded ' +
                 'with yellow mustard, ketchup, and grated cheese.',
    stallId: 'hepaslane-burgers',
    stallName: 'Hepaslane Street Grill',
    campusId: 'feu',
    category: 'Sandwiches & Bakery',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.1,
    reviewsCount: 14,
    lastUpdated: '2026-06-21T18:00:00Z',
    tags: ['50-75']
  },
  {
    id: 'lola-elena-lugaw',
    name: 'Special Lugaw with Egg',
    price: 35,
    description: 'Steaming hot Filipino rice porridge topped with ' +
                 'toasted garlic, spring onions, and a hard-boiled egg.',
    stallId: 'lola-elenas',
    stallName: "Lola Elena's Pancit & Lugawan",
    campusId: 'feu',
    category: 'Snacks & Street Food',
    image: lugawWithEggImg,
    rating: 4.5,
    reviewsCount: 22,
    lastUpdated: '2026-06-29T06:30:00Z',
    tags: ['under-50']
  },
  {
    id: 'lola-elena-pancit',
    name: 'Pancit Canton Big Plate',
    price: 45,
    description: 'A huge portion of stir-fried canton noodles with ' +
                 'shredded vegetables and sliced fishballs.',
    stallId: 'lola-elenas',
    stallName: "Lola Elena's Pancit & Lugawan",
    campusId: 'feu',
    category: 'Noodles/Pasta',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.3,
    reviewsCount: 15,
    lastUpdated: '2026-06-28T09:00:00Z',
    tags: ['under-50']
  },
  {
    id: 'mendiola-siomai-rice-combo',
    name: 'Mendiola Siomai Rice (5 pcs)',
    price: 50,
    description: 'Five mixed pork/beef siomai, unlimited chili ' +
                 'garlic paste, and fried rice.',
    stallId: 'mendiola-siomai',
    stallName: 'Mendiola Siomai & Fried Rice',
    campusId: 'ceu',
    category: 'Rice Meals',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewsCount: 51,
    lastUpdated: '2026-06-30T11:00:00Z',
    tags: ['under-50']
  },
  {
    id: 'mendiola-gulaman',
    name: 'Giant Samalamig / Gulaman',
    price: 15,
    description: 'Sweet, refreshing iced brown sugar drink with ' +
                 'chewy gelatin cubes.',
    stallId: 'mendiola-siomai',
    stallName: 'Mendiola Siomai & Fried Rice',
    campusId: 'ceu',
    category: 'Drinks & Desserts',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.2,
    reviewsCount: 12,
    lastUpdated: '2026-06-25T13:00:00Z',
    tags: ['under-50']
  },
  {
    id: 'beda-red-sisig',
    name: 'Sizzling Pork Sisig Rice',
    price: 89,
    description: 'Crispy pork sisig topped with raw egg, green chili, ' +
                 'citrus calamansi, and garlic fried rice.',
    stallId: 'beda-diners',
    stallName: 'Beda Red Diners',
    campusId: 'sanbeda',
    category: 'Rice Meals',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 38,
    lastUpdated: '2026-06-30T12:30:00Z',
    tags: ['75-100']
  },
  {
    id: 'beda-red-chix',
    name: 'Crispy Red Chicken Poppers',
    price: 75,
    description: 'Double-fried chicken poppers in sweet glaze ' +
                 'sauce served over hot white rice.',
    stallId: 'beda-diners',
    stallName: 'Beda Red Diners',
    campusId: 'sanbeda',
    category: 'Rice Meals',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec' +
           '?w=500&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewsCount: 11,
    lastUpdated: '2026-06-28T14:40:00Z',
    tags: ['50-75']
  },
  {
    id: 'ue-burger-steak',
    name: 'Sizzling Burger Steak Rice',
    price: 59,
    description: 'Sizzling burger patty with mushroom gravy and ' +
                 'toasted garlic, served with white rice.',
    stallId: 'ue-sizzling',
    stallName: 'Gastambide Sizzling & Grill',
    campusId: 'ue',
    category: 'Rice Meals',
    image: sizzlingBurgerSteakImg,
    rating: 4.5,
    reviewsCount: 31,
    lastUpdated: '2026-07-05T12:00:00Z',
    tags: ['50-75']
  },
  {
    id: 'nu-chicken-rice',
    name: 'Giant Crispy Chicken Rice',
    price: 65,
    description: 'Crispy deep-fried chicken wing served with ' +
                 'flavorful java rice and hot gravy.',
    stallId: 'nu-chicken',
    stallName: 'Jhocson Crispy Chicken',
    campusId: 'nu',
    category: 'Rice Meals',
    image: crispyChickenRiceImg,
    rating: 4.7,
    reviewsCount: 48,
    lastUpdated: '2026-07-05T12:00:00Z',
    tags: ['50-75']
  },
  {
    id: 'love-pasta-carbonara',
    name: 'Creamy Carbonara',
    price: 65,
    description: 'Creamy carbonara pasta topped with crispy ' +
                 'bacon bits, chopped parsley, and parmesan.',
    stallId: 'love-pasta',
    stallName: 'Love Pasta',
    campusId: 'ust',
    category: 'Noodles/Pasta',
    image: creamyCarbonaraImg,
    rating: 4.8,
    reviewsCount: 54,
    lastUpdated: '2026-07-06T12:00:00Z',
    tags: ['50-75']
  },
  {
    id: 'feu-kwek-kwek',
    name: 'Kwek-Kwek Platter (5 pcs)',
    price: 25,
    description: 'Deep-fried orange battered quail eggs served ' +
                 'with sweet-sour vinegar sauce.',
    stallId: 'feu-tusok',
    stallName: 'FEU Tusok-Tusok Station',
    campusId: 'feu',
    category: 'Snacks & Street Food',
    image: kwekKwekPlatterImg,
    rating: 4.7,
    reviewsCount: 89,
    lastUpdated: '2026-07-05T12:00:00Z',
    tags: ['under-50']
  },
  {
    id: 'd-cream-milk-tea',
    name: 'Golden Sun Milk Tea (M)',
    price: 45,
    description: 'Classic creamy milk tea infused with brown sugar ' +
                 'flavor and boba pearls.',
    stallId: 'd-cream',
    stallName: "D'Cream Coffee & Tea",
    campusId: 'ust',
    category: 'Drinks & Desserts',
    image: icedMilkTeaImg,
    rating: 4.8,
    reviewsCount: 120,
    lastUpdated: '2026-07-07T12:00:00Z',
    tags: ['under-50']
  },
  {
    id: 'tinapayan-cheese-rolls',
    name: 'Sweet Cheese Rolls (2 pcs)',
    price: 35,
    description: 'Soft rolls filled with cheddar cheese, brushed ' +
                 'with butter and sprinkled with sugar.',
    stallId: 'tinapayan',
    stallName: 'Tinapayan Festival',
    campusId: 'ust',
    category: 'Sandwiches & Bakery',
    image: cheeseRollsImg,
    rating: 4.9,
    reviewsCount: 180,
    lastUpdated: '2026-07-08T12:00:00Z',
    tags: ['under-50']
  }
];

export const REVIEWS = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Juan Dela Cruz',
    targetId: 'angkong-siomai-pork',
    targetType: 'meal',
    rating: 5,
    comment: 'Angkong siomai is the best in U-Belt! Best paired ' +
             'with extra chili. Still ₱55 as of June.',
    budgetFeedback: 'Still ₱55 as of June.',
    createdAt: '2026-06-28T14:00:00Z'
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Maria Santos',
    targetId: 'ate-ricas-bacon',
    targetType: 'meal',
    rating: 4,
    comment: 'Cheesy bacon goodness! Sometimes the line takes 10 ' +
             'minutes but worth it. Price is ₱69.',
    budgetFeedback: 'Updated to ₱69.',
    createdAt: '2026-06-30T09:30:00Z'
  },
  {
    id: 'r3',
    userId: 'u3',
    userName: 'Mark Aquino',
    targetId: 'dimsum-siomai-rice',
    targetType: 'meal',
    rating: 5,
    comment: 'Perfect for petsa de peligro. Big portions of ' +
             'siomai under ₱50.',
    budgetFeedback: 'Still ₱49.',
    createdAt: '2026-06-30T10:15:00Z'
  },
  {
    id: 'r4',
    userId: 'u4',
    userName: 'Kyle FEU',
    targetId: 'hepaslane-burger-cheese',
    targetType: 'meal',
    rating: 4,
    comment: 'Classic Gastambide burger. Tastes amazing for its price.',
    budgetFeedback: 'P45 super cheap.',
    createdAt: '2026-06-30T14:10:00Z'
  }
];
