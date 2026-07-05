import { CAMPUSES, FOOD_STALLS, MEALS, REVIEWS } from '../constants';
import type { Campus, FoodStall, Meal, Review, Contribution } from '../types';

// Storage keys
const KEY_MEALS = 'ub_meals';
const KEY_STALLS = 'ub_stalls';
const KEY_REVIEWS = 'ub_reviews';
const KEY_CONTRIBUTIONS = 'ub_contributions';

// Initialize default data if not present in localStorage
export function initializeDB() {
  if (!localStorage.getItem(KEY_MEALS)) {
    localStorage.setItem(KEY_MEALS, JSON.stringify(MEALS));
  }
  if (!localStorage.getItem(KEY_STALLS)) {
    localStorage.setItem(KEY_STALLS, JSON.stringify(FOOD_STALLS));
  }
  if (!localStorage.getItem(KEY_REVIEWS)) {
    localStorage.setItem(KEY_REVIEWS, JSON.stringify(REVIEWS));
  }
  if (!localStorage.getItem(KEY_CONTRIBUTIONS)) {
    const defaultContributions: Contribution[] = [
      {
        id: 'c1',
        userId: 'u1',
        userName: 'Juan Dela Cruz',
        type: 'price_update',
        details: 'Verified Pork Siomai Rice is still ₱55',
        createdAt: '2026-06-28T14:00:00Z'
      },
      {
        id: 'c2',
        userId: 'u2',
        userName: 'Maria Santos',
        type: 'add_review',
        details: 'Submitted review for Bacon Bacsilog',
        createdAt: '2026-06-30T09:30:00Z'
      }
    ];
    localStorage.setItem(KEY_CONTRIBUTIONS, JSON.stringify(defaultContributions));
  }
}

// Ensure database is initialized
initializeDB();

// Helper to read storage
function readStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Helper to write storage
function writeStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const dbService = {
  // Campuses (static)
  getCampuses(): Campus[] {
    return CAMPUSES;
  },

  getCampusById(id: string): Campus | undefined {
    return CAMPUSES.find(c => c.id === id);
  },

  // Meals
  getMeals(): Meal[] {
    return readStorage<Meal>(KEY_MEALS);
  },

  getMealById(id: string): Meal | undefined {
    return this.getMeals().find(m => m.id === id);
  },

  getMealsByCampus(campusId: string): Meal[] {
    return this.getMeals().filter(m => m.campusId === campusId);
  },

  addMeal(meal: Omit<Meal, 'id' | 'rating' | 'reviewsCount' | 'lastUpdated' | 'tags'> & { id?: string }): Meal {
    const meals = this.getMeals();
    
    // Determine budget tags based on price
    const tags: Meal['tags'] = [];
    if (meal.price < 50) tags.push('under-50');
    else if (meal.price <= 75) tags.push('50-75');
    else if (meal.price <= 100) tags.push('75-100');
    else tags.push('above-100');

    const newMeal: Meal = {
      ...meal,
      id: meal.id || `meal-${Date.now()}`,
      rating: 5.0, // default new meal rating
      reviewsCount: 0,
      lastUpdated: new Date().toISOString(),
      tags
    };

    meals.push(newMeal);
    writeStorage(KEY_MEALS, meals);

    // Update food stall's menu item list
    const stalls = this.getStalls();
    const stallIdx = stalls.findIndex(s => s.id === meal.stallId);
    if (stallIdx !== -1) {
      stalls[stallIdx].menuItemIds.push(newMeal.id);
      writeStorage(KEY_STALLS, stalls);
    }

    return newMeal;
  },

  updateMealPrice(mealId: string, newPrice: number, userId: string, userName: string): Meal | undefined {
    const meals = this.getMeals();
    const idx = meals.findIndex(m => m.id === mealId);
    if (idx === -1) return undefined;

    const oldPrice = meals[idx].price;
    meals[idx].price = newPrice;
    meals[idx].lastUpdated = new Date().toISOString();
    
    // Recalculate tags
    const tags: Meal['tags'] = [];
    if (newPrice < 50) tags.push('under-50');
    else if (newPrice <= 75) tags.push('50-75');
    else if (newPrice <= 100) tags.push('75-100');
    else tags.push('above-100');
    meals[idx].tags = tags;

    writeStorage(KEY_MEALS, meals);

    // Add contribution
    this.addContribution({
      userId,
      userName,
      type: 'price_update',
      details: `Updated ${meals[idx].name} price from ₱${oldPrice} to ₱${newPrice}`
    });

    return meals[idx];
  },

  // Food Stalls
  getStalls(): FoodStall[] {
    return readStorage<FoodStall>(KEY_STALLS);
  },

  getStallById(id: string): FoodStall | undefined {
    return this.getStalls().find(s => s.id === id);
  },

  getStallsByCampus(campusId: string): FoodStall[] {
    return this.getStalls().filter(s => s.campusId === campusId);
  },

  addStall(stall: Omit<FoodStall, 'id' | 'rating' | 'reviewsCount' | 'menuItemIds'> & { id?: string }): FoodStall {
    const stalls = this.getStalls();
    const newStall: FoodStall = {
      ...stall,
      id: stall.id || `stall-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      menuItemIds: []
    };
    stalls.push(newStall);
    writeStorage(KEY_STALLS, stalls);
    return newStall;
  },

  // Reviews
  getReviews(targetId: string, targetType: 'meal' | 'stall'): Review[] {
    return readStorage<Review>(KEY_REVIEWS).filter(
      r => r.targetId === targetId && r.targetType === targetType
    );
  },

  addReview(review: Omit<Review, 'id' | 'createdAt'> & { id?: string }): Review {
    const reviews = readStorage<Review>(KEY_REVIEWS);
    const newReview: Review = {
      ...review,
      id: review.id || `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    reviews.push(newReview);
    writeStorage(KEY_REVIEWS, reviews);

    // Update average ratings
    if (review.targetType === 'meal') {
      const meals = this.getMeals();
      const idx = meals.findIndex(m => m.id === review.targetId);
      if (idx !== -1) {
        const mealReviews = reviews.filter(r => r.targetId === review.targetId && r.targetType === 'meal');
        const avg = mealReviews.reduce((sum, r) => sum + r.rating, 0) / mealReviews.length;
        meals[idx].rating = parseFloat(avg.toFixed(1));
        meals[idx].reviewsCount = mealReviews.length;
        writeStorage(KEY_MEALS, meals);

        // Also refresh Stall overall rating based on its meals
        const stallId = meals[idx].stallId;
        const stallMeals = meals.filter(m => m.stallId === stallId);
        const ratedMeals = stallMeals.filter(m => m.reviewsCount > 0);
        if (ratedMeals.length > 0) {
          const stallAvg = ratedMeals.reduce((sum, m) => sum + m.rating, 0) / ratedMeals.length;
          const stalls = this.getStalls();
          const sIdx = stalls.findIndex(s => s.id === stallId);
          if (sIdx !== -1) {
            stalls[sIdx].rating = parseFloat(stallAvg.toFixed(1));
            stalls[sIdx].reviewsCount = ratedMeals.reduce((sum, m) => sum + m.reviewsCount, 0);
            writeStorage(KEY_STALLS, stalls);
          }
        }
      }
    } else {
      // Direct Stall Review
      const stalls = this.getStalls();
      const idx = stalls.findIndex(s => s.id === review.targetId);
      if (idx !== -1) {
        const stallReviews = reviews.filter(r => r.targetId === review.targetId && r.targetType === 'stall');
        const avg = stallReviews.reduce((sum, r) => sum + r.rating, 0) / stallReviews.length;
        stalls[idx].rating = parseFloat(avg.toFixed(1));
        stalls[idx].reviewsCount = stallReviews.length;
        writeStorage(KEY_STALLS, stalls);
      }
    }

    // Add contribution
    const targetName = review.targetType === 'meal' 
      ? this.getMealById(review.targetId)?.name || 'a meal'
      : this.getStallById(review.targetId)?.name || 'a food stall';
      
    this.addContribution({
      userId: review.userId,
      userName: review.userName,
      type: 'add_review',
      details: `Wrote a review for ${targetName}`
    });

    return newReview;
  },

  // Contributions
  getContributions(): Contribution[] {
    return readStorage<Contribution>(KEY_CONTRIBUTIONS).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getContributionsByUser(userId: string): Contribution[] {
    return this.getContributions().filter(c => c.userId === userId);
  },

  addContribution(contribution: Omit<Contribution, 'id' | 'createdAt'>): Contribution {
    const list = this.getContributions();
    const newContrib: Contribution = {
      ...contribution,
      id: `contrib-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(newContrib);
    writeStorage(KEY_CONTRIBUTIONS, list);

    // Update user contributions count if active
    const userSession = localStorage.getItem('ub_user_session');
    if (userSession) {
      const user = JSON.parse(userSession);
      if (user.id === contribution.userId) {
        user.contributionsCount = (user.contributionsCount || 0) + 1;
        localStorage.setItem('ub_user_session', JSON.stringify(user));
        
        // Also update in registered users list
        const users = JSON.parse(localStorage.getItem('ub_users') || '[]');
        const uIdx = users.findIndex((u: any) => u.id === user.id);
        if (uIdx !== -1) {
          users[uIdx].contributionsCount = user.contributionsCount;
          localStorage.setItem('ub_users', JSON.stringify(users));
        }
      }
    }

    return newContrib;
  }
};
