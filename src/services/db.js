import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  writeBatch 
} from 'firebase/firestore';
import { db } from './firebase';
import { CAMPUSES, FOOD_STALLS, MEALS, REVIEWS } from '../constants';
import { dbFallbackService } from './dbFallback';

// Local assets mapping to resolve dev paths in production
import siomaiRiceImg from '../assets/steamed_pork_siomai_rice.png';
import lugawWithEggImg from '../assets/special_lugaw_with_egg.png';
import sizzlingBurgerSteakImg from '../assets/sizzling_burger_steak.png';
import crispyChickenRiceImg from '../assets/crispy_chicken_rice.png';
import dimsumTreatsStallImg from '../assets/dimsum_treats_stall.png';
import creamyCarbonaraImg from '../assets/creamy_carbonara.png';
import kwekKwekPlatterImg from '../assets/kwek_kwek_platter.png';
import icedMilkTeaImg from '../assets/iced_milk_tea.png';
import cheeseRollsImg from '../assets/cheese_rolls.png';

const localAssetMap = {
  '/src/assets/steamed_pork_siomai_rice.png': siomaiRiceImg,
  '/src/assets/special_lugaw_with_egg.png': lugawWithEggImg,
  '/src/assets/sizzling_burger_steak.png': sizzlingBurgerSteakImg,
  '/src/assets/crispy_chicken_rice.png': crispyChickenRiceImg,
  '/src/assets/dimsum_treats_stall.png': dimsumTreatsStallImg,
  '/src/assets/creamy_carbonara.png': creamyCarbonaraImg,
  '/src/assets/kwek_kwek_platter.png': kwekKwekPlatterImg,
  '/src/assets/iced_milk_tea.png': icedMilkTeaImg,
  '/src/assets/cheese_rolls.png': cheeseRollsImg,
};

let useLocalStorageFallback = false;

// Helper to convert Firestore snapshots to plain arrays
const mapSnap = (snap) => snap.docs.map(doc => {
  const data = doc.data();
  if (data.image && localAssetMap[data.image]) {
    data.image = localAssetMap[data.image];
  }
  return { id: doc.id, ...data };
});

// Seed database concurrently on first load if empty
async function initializeDB() {
  try {
    const [stallsSnap, mealsSnap, reviewsSnap] = await Promise.all([
      getDocs(collection(db, 'stalls')),
      getDocs(collection(db, 'meals')),
      getDocs(collection(db, 'reviews'))
    ]);

    const existingStallIds = new Set(stallsSnap.docs.map(d => d.id));
    const existingMealIds = new Set(mealsSnap.docs.map(d => d.id));
    const existingReviewIds = new Set(reviewsSnap.docs.map(d => d.id));

    const batch = writeBatch(db);
    let needsCommit = false;

    FOOD_STALLS.forEach((stall) => {
      if (!existingStallIds.has(stall.id)) {
        console.log(`Seeding missing stall to Firestore: ${stall.name}`);
        batch.set(doc(db, 'stalls', stall.id), stall);
        needsCommit = true;
      }
    });

    MEALS.forEach((meal) => {
      if (!existingMealIds.has(meal.id)) {
        console.log(`Seeding missing meal to Firestore: ${meal.name}`);
        batch.set(doc(db, 'meals', meal.id), meal);
        needsCommit = true;
      }
    });

    REVIEWS.forEach((review) => {
      if (!existingReviewIds.has(review.id)) {
        console.log(`Seeding missing review to Firestore: ${review.id}`);
        batch.set(doc(db, 'reviews', review.id), review);
        needsCommit = true;
      }
    });

    if (needsCommit) {
      await batch.commit();
      console.log('Database successfully synced with new mock data!');
    }
  } catch (error) {
    console.error('Error initializing Firestore:', error);
  }
}

// Failsafe: Fallback to LocalStorage if Firestore takes longer than 10 seconds (e.g. blocked by school Wi-Fi)
const timeoutPromise = new Promise((resolve) => {
  setTimeout(() => {
    if (!useLocalStorageFallback) {
      console.warn("Firebase initialization timed out. Falling back to local data storage!");
      useLocalStorageFallback = true;
    }
    resolve();
  }, 10000);
});

export const dbReady = Promise.race([
  initializeDB().then(() => {
    console.log("Firebase connected successfully.");
    useLocalStorageFallback = false; // Ensure we use live DB once connected
  }),
  timeoutPromise
]);

// Rating aggregations helper
async function recalculateMealRatings(mealId) {
  const mealRef = doc(db, 'meals', mealId);
  const q = query(
    collection(db, 'reviews'),
    where('targetId', '==', mealId),
    where('targetType', '==', 'meal')
  );
  const snap = await getDocs(q);
  const list = mapSnap(snap);
  const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  await updateDoc(mealRef, {
    rating: parseFloat(avg.toFixed(1)),
    reviewsCount: list.length
  });
}

async function recalculateStallRatings(stallId) {
  const stallRef = doc(db, 'stalls', stallId);
  const snap = await getDocs(collection(db, 'meals'));
  const allMeals = mapSnap(snap);
  const stallMeals = allMeals.filter(m => m.stallId === stallId);
  const ratedMeals = stallMeals.filter(m => m.reviewsCount > 0);
  
  if (ratedMeals.length > 0) {
    const stallAvg = ratedMeals.reduce((sum, m) => sum + m.rating, 0) / ratedMeals.length;
    await updateDoc(stallRef, {
      rating: parseFloat(stallAvg.toFixed(1)),
      reviewsCount: ratedMeals.reduce((sum, m) => sum + m.reviewsCount, 0)
    });
  }
}

export const dbService = {
  getCampuses() {
    return CAMPUSES;
  },

  getCampusById(id) {
    return CAMPUSES.find(c => c.id === id);
  },

  // Meals
  async getMeals() {
    await dbReady;
    if (useLocalStorageFallback) return dbFallbackService.getMeals();
    const snap = await getDocs(collection(db, 'meals'));
    return mapSnap(snap);
  },

  async getMealById(id) {
    await dbReady;
    if (useLocalStorageFallback) return dbFallbackService.getMealById(id);
    const docRef = doc(db, 'meals', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.image && localAssetMap[data.image]) {
        data.image = localAssetMap[data.image];
      }
      return { id: snap.id, ...data };
    }
    return null;
  },

  async getMealsByCampus(campusId) {
    await dbReady;
    if (useLocalStorageFallback) return dbFallbackService.getMealsByCampus(campusId);
    const q = query(collection(db, 'meals'), where('campusId', '==', campusId));
    const snap = await getDocs(q);
    return mapSnap(snap);
  },

  async addMeal(meal) {
    await dbReady;
    if (useLocalStorageFallback) return dbFallbackService.addMeal(meal);

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
    if (useLocalStorageFallback) return dbFallbackService.updateMealPrice(mealId, newPrice, userId, userName);

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
    if (useLocalStorageFallback) return dbFallbackService.getStalls();
    const snap = await getDocs(collection(db, 'stalls'));
    return mapSnap(snap);
  },

  async getStallById(id) {
    await dbReady;
    if (useLocalStorageFallback) return dbFallbackService.getStallById(id);
    const docRef = doc(db, 'stalls', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.image && localAssetMap[data.image]) {
        data.image = localAssetMap[data.image];
      }
      return { id: snap.id, ...data };
    }
    return null;
  },

  async getStallsByCampus(campusId) {
    await dbReady;
    if (useLocalStorageFallback) return dbFallbackService.getStallsByCampus(campusId);
    const q = query(collection(db, 'stalls'), where('campusId', '==', campusId));
    const snap = await getDocs(q);
    return mapSnap(snap);
  },

  async addStall(stall) {
    await dbReady;
    if (useLocalStorageFallback) return dbFallbackService.addStall(stall);

    const newStall = {
      ...stall,
      rating: 5.0,
      reviewsCount: 0,
      menuItemIds: []
    };
    const docRef = await addDoc(collection(db, 'stalls'), newStall);
    return { id: docRef.id, ...newStall };
  },

  // Reviews
  async getReviews(targetId, targetType) {
    await dbReady;
    if (useLocalStorageFallback) return dbFallbackService.getReviews(targetId, targetType);
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
    if (useLocalStorageFallback) return dbFallbackService.addReview(review);

    const newReview = {
      ...review,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'reviews'), newReview);

    // Recalculate average ratings
    if (review.targetType === 'meal') {
      await recalculateMealRatings(review.targetId);
      const mealRef = doc(db, 'meals', review.targetId);
      const mealSnap = await getDoc(mealRef);
      if (mealSnap.exists()) {
        await recalculateStallRatings(mealSnap.data().stallId);
      }
    } else {
      const stallRef = doc(db, 'stalls', review.targetId);
      const stallSnap = await getDoc(stallRef);
      if (stallSnap.exists()) {
        const q = query(
          collection(db, 'reviews'),
          where('targetId', '==', review.targetId),
          where('targetType', '==', 'stall')
        );
        const allReviewsSnap = await getDocs(q);
        const list = mapSnap(allReviewsSnap);
        const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
        await updateDoc(stallRef, {
          rating: parseFloat(avg.toFixed(1)),
          reviewsCount: list.length
        });
      }
    }

    let targetName = 'Item';
    if (review.targetType === 'meal') {
      const meal = await this.getMealById(review.targetId);
      if (meal) targetName = meal.name;
    } else {
      const stall = await this.getStallById(review.targetId);
      if (stall) targetName = stall.name;
    }

    await this.addContribution({
      userId: review.userId,
      userName: review.userName,
      type: 'add_review',
      details: `Wrote a review for ${targetName}`
    });

    return { id: docRef.id, ...newReview };
  },

  // Contributions
  async getContributions() {
    await dbReady;
    if (useLocalStorageFallback) return dbFallbackService.getContributions();
    const q = query(collection(db, 'contributions'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return mapSnap(snap);
  },

  async getContributionsByUser(userId) {
    await dbReady;
    if (useLocalStorageFallback) return dbFallbackService.getContributionsByUser(userId);
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
    if (useLocalStorageFallback) return dbFallbackService.addContribution(contribution);

    const newContrib = {
      ...contribution,
      createdAt: new Date().toISOString()
    };
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
