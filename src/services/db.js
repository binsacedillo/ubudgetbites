import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  writeBatch 
} from 'firebase/firestore';
import { db } from './firebase';
import { CAMPUSES, FOOD_STALLS, MEALS, REVIEWS } from '../constants';

// LocalStorage Keys for fallback
const KEY_MEALS = 'ub_meals';
const KEY_STALLS = 'ub_stalls';
const KEY_REVIEWS = 'ub_reviews';
const KEY_CONTRIBUTIONS = 'ub_contributions';

let useLocalStorageFallback = false;

// Helper to convert Firestore snapshots to plain arrays
const mapSnap = (snap) => snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// LocalStorage Fallback Helpers
function readStorage(key, defaultVal = []) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
}

function writeStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function initializeLocalStorage() {
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

// Seed database concurrently on first load if empty
async function initializeDB() {
  try {
    const [stallsSnap, mealsSnap, reviewsSnap] = await Promise.all([
      getDocs(collection(db, 'stalls')),
      getDocs(collection(db, 'meals')),
      getDocs(collection(db, 'reviews'))
    ]);
    
    const promises = [];
    
    if (stallsSnap.empty) {
      console.log('Seeding Firestore stalls...');
      const batch = writeBatch(db);
      FOOD_STALLS.forEach((stall) => {
        batch.set(doc(db, 'stalls', stall.id), stall);
      });
      promises.push(batch.commit());
    }

    if (mealsSnap.empty) {
      console.log('Seeding Firestore meals...');
      const batch = writeBatch(db);
      MEALS.forEach((meal) => {
        batch.set(doc(db, 'meals', meal.id), meal);
      });
      promises.push(batch.commit());
    }

    if (reviewsSnap.empty) {
      console.log('Seeding Firestore reviews...');
      const batch = writeBatch(db);
      REVIEWS.forEach((review) => {
        batch.set(doc(db, 'reviews', review.id), review);
      });
      promises.push(batch.commit());
    }

    if (promises.length > 0) {
      await Promise.all(promises);
      console.log('Database successfully seeded!');
    }
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    // Fallback immediately on connection/permission errors
    useLocalStorageFallback = true;
  }
}

// Race database ready with a 2.5 second timeout
const timeoutPromise = new Promise((resolve) => {
  setTimeout(() => {
    if (loadingStateActive()) {
      console.warn("Firebase initialization timed out. Falling back to local data storage!");
      useLocalStorageFallback = true;
    }
    resolve();
  }, 2500);
});

// Helper check to see if database was successfully loaded before timeout
function loadingStateActive() {
  return !useLocalStorageFallback;
}

export const dbReady = Promise.race([
  initializeDB().then(() => {
    // If completed successfully without throwing
    console.log("Firebase connected successfully.");
  }),
  timeoutPromise
]);

export const dbService = {
  // Campuses
  getCampuses() {
    return CAMPUSES;
  },

  getCampusById(id) {
    return CAMPUSES.find(c => c.id === id);
  },

  // Meals
  async getMeals() {
    await dbReady;
    if (useLocalStorageFallback) {
      initializeLocalStorage();
      return readStorage(KEY_MEALS);
    }
    const snap = await getDocs(collection(db, 'meals'));
    return mapSnap(snap);
  },

  async getMealById(id) {
    await dbReady;
    if (useLocalStorageFallback) {
      initializeLocalStorage();
      return readStorage(KEY_MEALS).find(m => m.id === id) || null;
    }
    const docRef = doc(db, 'meals', id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getMealsByCampus(campusId) {
    await dbReady;
    if (useLocalStorageFallback) {
      initializeLocalStorage();
      return readStorage(KEY_MEALS).filter(m => m.campusId === campusId);
    }
    const q = query(collection(db, 'meals'), where('campusId', '==', campusId));
    const snap = await getDocs(q);
    return mapSnap(snap);
  },

  async addMeal(meal) {
    await dbReady;
    
    const tags = [];
    if (meal.price < 50) tags.push('under-50');
    else if (meal.price <= 75) tags.push('50-75');
    else if (meal.price <= 100) tags.push('75-100');
    else tags.push('above-100');

    const newMeal = {
      ...meal,
      rating: 5.0,
      reviewsCount: 0,
      lastUpdated: new Date().toISOString(),
      tags
    };

    if (useLocalStorageFallback) {
      initializeLocalStorage();
      const meals = readStorage(KEY_MEALS);
      const createdMeal = { ...newMeal, id: meal.id || `meal-${Date.now()}` };
      meals.push(createdMeal);
      writeStorage(KEY_MEALS, meals);

      // Update stall
      const stalls = readStorage(KEY_STALLS);
      const stallIdx = stalls.findIndex(s => s.id === meal.stallId);
      if (stallIdx !== -1) {
        stalls[stallIdx].menuItemIds.push(createdMeal.id);
        writeStorage(KEY_STALLS, stalls);
      }
      return createdMeal;
    }

    const docRef = await addDoc(collection(db, 'meals'), newMeal);
    
    const stallRef = doc(db, 'stalls', meal.stallId);
    const stallSnap = await getDoc(stallRef);
    if (stallSnap.exists()) {
      const stallData = stallSnap.data();
      const menuIds = stallData.menuItemIds || [];
      await updateDoc(stallRef, {
        menuItemIds: [...menuIds, docRef.id]
      });
    }

    return { id: docRef.id, ...newMeal };
  },

  async updateMealPrice(mealId, newPrice, userId, userName) {
    await dbReady;
    
    if (useLocalStorageFallback) {
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

      await this.addContribution({
        userId,
        userName,
        type: 'price_update',
        details: `Updated ${meals[idx].name} price from ₱${oldPrice} to ₱${newPrice}`
      });
      return meals[idx];
    }

    const docRef = doc(db, 'meals', mealId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const mealData = snap.data();
    const oldPrice = mealData.price;

    const tags = [];
    if (newPrice < 50) tags.push('under-50');
    else if (newPrice <= 75) tags.push('50-75');
    else if (newPrice <= 100) tags.push('75-100');
    else tags.push('above-100');

    await updateDoc(docRef, {
      price: newPrice,
      tags,
      lastUpdated: new Date().toISOString()
    });

    await this.addContribution({
      userId,
      userName,
      type: 'price_update',
      details: `Updated ${mealData.name} price from ₱${oldPrice} to ₱${newPrice}`
    });

    return { id: mealId, ...mealData, price: newPrice, tags };
  },

  // Food Stalls
  async getStalls() {
    await dbReady;
    if (useLocalStorageFallback) {
      initializeLocalStorage();
      return readStorage(KEY_STALLS);
    }
    const snap = await getDocs(collection(db, 'stalls'));
    return mapSnap(snap);
  },

  async getStallById(id) {
    await dbReady;
    if (useLocalStorageFallback) {
      initializeLocalStorage();
      return readStorage(KEY_STALLS).find(s => s.id === id) || null;
    }
    const docRef = doc(db, 'stalls', id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getStallsByCampus(campusId) {
    await dbReady;
    if (useLocalStorageFallback) {
      initializeLocalStorage();
      return readStorage(KEY_STALLS).filter(s => s.campusId === campusId);
    }
    const q = query(collection(db, 'stalls'), where('campusId', '==', campusId));
    const snap = await getDocs(q);
    return mapSnap(snap);
  },

  async addStall(stall) {
    await dbReady;
    
    const newStall = {
      ...stall,
      rating: 5.0,
      reviewsCount: 0,
      menuItemIds: []
    };

    if (useLocalStorageFallback) {
      initializeLocalStorage();
      const stalls = readStorage(KEY_STALLS);
      const createdStall = { ...newStall, id: stall.id || `stall-${Date.now()}` };
      stalls.push(createdStall);
      writeStorage(KEY_STALLS, stalls);
      return createdStall;
    }

    const docRef = await addDoc(collection(db, 'stalls'), newStall);
    return { id: docRef.id, ...newStall };
  },

  // Reviews
  async getReviews(targetId, targetType) {
    await dbReady;
    if (useLocalStorageFallback) {
      initializeLocalStorage();
      return readStorage(KEY_REVIEWS).filter(
        r => r.targetId === targetId && r.targetType === targetType
      );
    }
    const q = query(
      collection(db, 'reviews'), 
      where('targetId', '==', targetId), 
      where('targetType', '==', targetType)
    );
    const snap = await getDocs(q);
    return mapSnap(snap);
  },

  async addReview(review) {
    await dbReady;
    
    const newReview = {
      ...review,
      createdAt: new Date().toISOString()
    };

    if (useLocalStorageFallback) {
      initializeLocalStorage();
      const reviews = readStorage(KEY_REVIEWS);
      const createdReview = { ...newReview, id: review.id || `rev-${Date.now()}` };
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
    }

    const docRef = await addDoc(collection(db, 'reviews'), newReview);

    // Refresh averages in Firestore
    if (review.targetType === 'meal') {
      const mealRef = doc(db, 'meals', review.targetId);
      const mealSnap = await getDoc(mealRef);
      if (mealSnap.exists()) {
        const mealData = mealSnap.data();
        const q = query(
          collection(db, 'reviews'),
          where('targetId', '==', review.targetId),
          where('targetType', '==', 'meal')
        );
        const allReviewsSnap = await getDocs(q);
        const list = mapSnap(allReviewsSnap);
        const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
        await updateDoc(mealRef, {
          rating: parseFloat(avg.toFixed(1)),
          reviewsCount: list.length
        });

        const stallRef = doc(db, 'stalls', mealData.stallId);
        const stallSnap = await getDoc(stallRef);
        if (stallSnap.exists()) {
          const mealsSnap = await getDocs(collection(db, 'meals'));
          const allMeals = mapSnap(mealsSnap);
          const stallMeals = allMeals.filter(m => m.stallId === mealData.stallId);
          const ratedMeals = stallMeals.filter(m => m.reviewsCount > 0);
          if (ratedMeals.length > 0) {
            const stallAvg = ratedMeals.reduce((sum, m) => sum + m.rating, 0) / ratedMeals.length;
            await updateDoc(stallRef, {
              rating: parseFloat(stallAvg.toFixed(1)),
              reviewsCount: ratedMeals.reduce((sum, m) => sum + m.reviewsCount, 0)
            });
          }
        }
      }
    }

    return { id: docRef.id, ...newReview };
  },

  // Contributions
  async getContributions() {
    await dbReady;
    if (useLocalStorageFallback) {
      return readStorage(KEY_CONTRIBUTIONS).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    const q = query(collection(db, 'contributions'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return mapSnap(snap);
  },

  async getContributionsByUser(userId) {
    await dbReady;
    if (useLocalStorageFallback) {
      return this.getContributions().then(list => list.filter(c => c.userId === userId));
    }
    const q = query(
      collection(db, 'contributions'), 
      where('userId', '==', userId), 
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return mapSnap(snap);
  },

  async addContribution(contribution) {
    await dbReady;
    const newContrib = {
      ...contribution,
      createdAt: new Date().toISOString()
    };

    if (useLocalStorageFallback) {
      const list = readStorage(KEY_CONTRIBUTIONS);
      const createdContrib = { ...newContrib, id: `contrib-${Date.now()}` };
      list.unshift(createdContrib);
      writeStorage(KEY_CONTRIBUTIONS, list);
      return createdContrib;
    }

    const docRef = await addDoc(collection(db, 'contributions'), newContrib);
    const userRef = doc(db, 'users', contribution.userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      await updateDoc(userRef, {
        contributionsCount: (userData.contributionsCount || 0) + 1
      });
    }
    return { id: docRef.id, ...newContrib };
  }
};
