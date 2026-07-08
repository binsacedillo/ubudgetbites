export const CAMPUSES = [
  { 
    id: 'ust', 
    name: 'UST', 
    fullName: 'University of Santo Tomas', 
    location: 'España Blvd, Sampaloc, Manila' 
  },
  { 
    id: 'feu', 
    name: 'FEU', 
    fullName: 'Far Eastern University', 
    location: 'Nicanor Reyes St, Sampaloc, Manila' 
  },
  { 
    id: 'ue', 
    name: 'UE', 
    fullName: 'University of the East', 
    location: 'Claro M. Recto Ave, Sampaloc, Manila' 
  },
  { 
    id: 'nu', 
    name: 'NU', 
    fullName: 'National University', 
    location: 'M.F. Jhocson St, Sampaloc, Manila' 
  },
  { 
    id: 'ceu', 
    name: 'CEU', 
    fullName: 'Centro Escolar University', 
    location: 'Mendiola St, San Miguel, Manila' 
  },
  { 
    id: 'sanbeda', 
    name: 'San Beda', 
    fullName: 'San Beda University', 
    location: 'Mendiola St, San Miguel, Manila' 
  }
];

export const CATEGORIES = [
  'Rice Meals',
  'Noodles/Pasta',
  'Snacks & Street Food',
  'Drinks & Desserts',
  'Sandwiches & Bakery'
];

export const BUDGET_TIERS = [
  { id: 'under-50', label: 'Under ₱50', max: 50 },
  { id: '50-75', label: '₱50–₱75', min: 50, max: 75 },
  { id: '75-100', label: '₱75–₱100', min: 75, max: 100 },
  { id: 'above-100', label: 'Above ₱100', min: 100 }
];

export * from './mockData';
