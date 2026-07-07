import { CAMPUSES, FOOD_STALLS, MEALS, REVIEWS } from '../constants';

const KEY_MEALS = 'ub_meals';
const KEY_STALLS = 'ub_stalls';
const KEY_REVIEWS = 'ub_reviews';
const KEY_CONTRIBUTIONS = 'ub_contributions';

export function readStorage(key, defaultVal = []) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
}

export function writeStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function initializeLocalStorage() {
  if (!localStorage.getItem(KEY_STALLS)) {
    localStorage.setItem(KEY_STALLS, JSON.stringify(FOOD_STALLS));
  }
  if (!localStorage.getItem(KEY_MEALS)) {
    localStorage.setItem(KEY_MEALS, JSON.stringify(MEALS));
  }
  if (!localStorage.getItem(KEY_REVIEWS)) {
    localStorage.setItem(KEY_REVIEWS, JSON.stringify(REVIEWS));
  }
}

export const dbFallbackService = {
  getMeals() {
    initializeLocalStorage();
    return readStorage(KEY_MEALS);
  },

  getMealById(id) {
    initializeLocalStorage();
    return readStorage(KEY_MEALS).find(m => m.id === id) || null;
  },

  getMealsByCampus(campusId) {
    initializeLocalStorage();
    return readStorage(KEY_MEALS).filter(m => m.campusId === campusId);
  },

  addMeal(meal) {
    initializeLocalStorage();
    const tags = [];
    if (meal.price < 50) tags.push('under-50');
    else if (meal.price <= 75) tags.push('50-75');
    else if (meal.price <= 100) tags.push('75-100');
    else tags.push('above-100');

    const createdMeal = {
      ...meal,
      id: meal.id || `meal-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      lastUpdated: new Date().toISOString(),
      tags
    };

    const meals = readStorage(KEY_MEALS);
    meals.push(createdMeal);
    writeStorage(KEY_MEALS, meals);

    const stalls = readStorage(KEY_STALLS);
    const stallIdx = stalls.findIndex(s => s.id === meal.stallId);
    if (stallIdx !== -1) {
      stalls[stallIdx].menuItemIds.push(createdMeal.id);
      writeStorage(KEY_STALLS, stalls);
    }
    return createdMeal;
  },

  updateMealPrice(mealId, newPrice, userId, userName) {
    initializeLocalStorage();
    const meals = readStorage(KEY_MEALS);
    const idx = meals.findIndex(m => m.id === mealId);
    if (idx === -1) return null;

    const oldPrice = meals[idx].price;
    meals[idx].price = newPrice;
    meals[idx].lastUpdated = new Date().toISOString();
    
    const tags = [];
    if (newPrice < 50) tags.push('under-50');
    else if (newPrice <= 75) tags.push('50-75');
    else if (newPrice <= 100) tags.push('75-100');
    else tags.push('above-100');
    meals[idx].tags = tags;

    writeStorage(KEY_MEALS, meals);

    this.addContribution({
      userId,
      userName,
      type: 'price_update',
      details: `Updated ${meals[idx].name} price from ₱${oldPrice} to ₱${newPrice}`
    });
    return meals[idx];
  },

  getStalls() {
    initializeLocalStorage();
    return readStorage(KEY_STALLS);
  },

  getStallById(id) {
    initializeLocalStorage();
    return readStorage(KEY_STALLS).find(s => s.id === id) || null;
  },

  getStallsByCampus(campusId) {
    initializeLocalStorage();
    return readStorage(KEY_STALLS).filter(s => s.campusId === campusId);
  },

  addStall(stall) {
    initializeLocalStorage();
    const stalls = readStorage(KEY_STALLS);
    const createdStall = {
      ...stall,
      id: stall.id || `stall-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      menuItemIds: []
    };
    stalls.push(createdStall);
    writeStorage(KEY_STALLS, stalls);
    return createdStall;
  },

  getReviews(targetId, targetType) {
    initializeLocalStorage();
    return readStorage(KEY_REVIEWS).filter(
      r => r.targetId === targetId && r.targetType === targetType
    );
  },

  addReview(review) {
    initializeLocalStorage();
    const reviews = readStorage(KEY_REVIEWS);
    const createdReview = {
      ...review,
      id: review.id || `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    reviews.push(createdReview);
    writeStorage(KEY_REVIEWS, reviews);

    // Update averages locally
    if (review.targetType === 'meal') {
      const meals = readStorage(KEY_MEALS);
      const idx = meals.findIndex(m => m.id === review.targetId);
      if (idx !== -1) {
        const mealReviews = reviews.filter(r => r.targetId === review.targetId && r.targetType === 'meal');
        const avg = mealReviews.reduce((sum, r) => sum + r.rating, 0) / mealReviews.length;
        meals[idx].rating = parseFloat(avg.toFixed(1));
        meals[idx].reviewsCount = mealReviews.length;
        writeStorage(KEY_MEALS, meals);

        const stallId = meals[idx].stallId;
        const stallMeals = meals.filter(m => m.stallId === stallId);
        const ratedMeals = stallMeals.filter(m => m.reviewsCount > 0);
        if (ratedMeals.length > 0) {
          const stallAvg = ratedMeals.reduce((sum, m) => sum + m.rating, 0) / ratedMeals.length;
          const stalls = readStorage(KEY_STALLS);
          const sIdx = stalls.findIndex(s => s.id === stallId);
          if (sIdx !== -1) {
            stalls[sIdx].rating = parseFloat(stallAvg.toFixed(1));
            stalls[sIdx].reviewsCount = ratedMeals.reduce((sum, m) => sum + m.reviewsCount, 0);
            writeStorage(KEY_STALLS, stalls);
          }
        }
      }
    }
    return createdReview;
  },

  getContributions() {
    return readStorage(KEY_CONTRIBUTIONS).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getContributionsByUser(userId) {
    return this.getContributions().filter(c => c.userId === userId);
  },

  addContribution(contribution) {
    const list = readStorage(KEY_CONTRIBUTIONS);
    const createdContrib = {
      ...contribution,
      id: `contrib-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(createdContrib);
    writeStorage(KEY_CONTRIBUTIONS, list);
    return createdContrib;
  }
};
