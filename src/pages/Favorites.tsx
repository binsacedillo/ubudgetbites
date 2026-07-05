import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Utensils, Store, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/db';
import { FoodCard } from '../components/cards/FoodCard';
import { StallCard } from '../components/cards/StallCard';

export const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'meals' | 'stalls'>('meals');

  // Load user's favorites from DB
  const favoriteMeals = useMemo(() => {
    if (!user || !user.favorites || !user.favorites.meals) return [];
    const allMeals = dbService.getMeals();
    return allMeals.filter((m) => user.favorites.meals.includes(m.id));
  }, [user]);

  const favoriteStalls = useMemo(() => {
    if (!user || !user.favorites || !user.favorites.stalls) return [];
    const allStalls = dbService.getStalls();
    return allStalls.filter((s) => user.favorites.stalls.includes(s.id));
  }, [user]);

  if (!user) {
    return (
      <div className="pb-24 pt-12 px-4 text-center max-w-sm mx-auto flex flex-col items-center justify-center animate-fade-in-up">
        <div className="bg-rose-50 text-rose-500 p-4 rounded-full mb-4 shadow-sm">
          <Heart size={36} className="fill-current" />
        </div>
        <h1 className="text-xl font-extrabold text-gray-900 mb-2">
          Your Favorites
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Log in as a student to save your favorite budget meals and view them here instantly.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 rounded-xl bg-gray-900 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn size={16} />
          Login to Continue
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 md:px-8 max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
          <Heart size={26} className="text-rose-500 fill-current" />
          My Saved Eats
        </h1>
        <p className="text-sm text-gray-500">
          Your bookmarked affordable stalls and meal selections.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-6">
        <button
          onClick={() => setActiveTab('meals')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'meals'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Utensils size={16} />
          Saved Meals ({favoriteMeals.length})
        </button>
        <button
          onClick={() => setActiveTab('stalls')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'stalls'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Store size={16} />
          Saved Stalls ({favoriteStalls.length})
        </button>
      </div>

      {/* Render Lists */}
      {activeTab === 'meals' ? (
        favoriteMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteMeals.map((meal) => (
              <div key={meal.id} className="animate-scale-in">
                <FoodCard meal={meal} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-3xl border border-gray-100 max-w-md mx-auto">
            <p className="text-gray-400 font-semibold mb-4 text-sm">No saved meals yet.</p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Browse Deals
            </button>
          </div>
        )
      ) : (
        favoriteStalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteStalls.map((stall) => (
              <div key={stall.id} className="animate-scale-in">
                <StallCard stall={stall} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-3xl border border-gray-100 max-w-md mx-auto">
            <p className="text-gray-400 font-semibold mb-4 text-sm">No saved food stalls yet.</p>
            <button
              onClick={() => navigate('/search')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Discover Stalls
            </button>
          </div>
        )
      )}
    </div>
  );
};
