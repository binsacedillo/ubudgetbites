export interface User {
  id: string;
  name: string;
  email: string;
  campus: string; // User's primary campus
  favorites: {
    meals: string[]; // Meal IDs
    stalls: string[]; // FoodStall IDs
  };
  contributionsCount: number;
  avatarUrl?: string;
  role: 'student' | 'moderator';
}

export interface Campus {
  id: string;
  name: string;
  fullName: string;
  location: string;
}

export interface FoodStall {
  id: string;
  name: string;
  description: string;
  campusId: string; // Link to Campus
  distance: string; // Walking distance (e.g., "5 mins walk")
  distanceMeters: number; // For sorting/filtering
  categories: string[]; // e.g. ["Rice Meals", "Drinks"]
  image: string;
  rating: number;
  reviewsCount: number;
  googleMapsUrl: string;
  openingHours: string;
  menuItemIds: string[];
}

export interface Meal {
  id: string;
  name: string;
  price: number;
  description: string;
  stallId: string; // Link to FoodStall
  stallName: string; // Cached for easy listing
  campusId: string; // Link to Campus (e.g. "UST")
  category: string; // Category name (e.g. "Rice Meals")
  image: string;
  rating: number;
  reviewsCount: number;
  lastUpdated: string; // Timestamp ISO
  tags: ('under-50' | '50-75' | '75-100' | 'above-100')[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  targetId: string; // Can be mealId or stallId
  targetType: 'meal' | 'stall';
  rating: number;
  comment: string;
  budgetFeedback?: string; // e.g., "Still ₱65 as of today"
  createdAt: string; // Timestamp ISO
}

export interface Contribution {
  id: string;
  userId: string;
  userName: string;
  type: 'add_meal' | 'price_update' | 'add_review';
  details: string; // Short summary: "Added Dimsum Treats", "Updated price of Bacsilog to ₱65"
  createdAt: string;
}
