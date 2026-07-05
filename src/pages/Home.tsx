import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, FilterX, Plus, RefreshCw } from 'lucide-react';
import { CAMPUSES, CATEGORIES, BUDGET_TIERS } from '../constants';
import { dbService } from '../services/db';
import { FoodCard } from '../components/cards/FoodCard';
import { useAuth } from '../contexts/AuthContext';
import { getCampusStyle } from '../utils/theme';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // States
  const [selectedCampus, setSelectedCampus] = useState<string>('ust'); // Default to UST for demo
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch all meals and active filter checks
  const meals = useMemo(() => dbService.getMeals(), []);
  const contributions = useMemo(() => dbService.getContributions().slice(0, 3), []);

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // 1. Campus filter
      if (selectedCampus && meal.campusId !== selectedCampus) {
        return false;
      }
      
      // 2. Category filter
      if (selectedCategory && meal.category !== selectedCategory) {
        return false;
      }

      // 3. Budget tier filter
      if (selectedBudget) {
        const tier = BUDGET_TIERS.find((t) => t.id === selectedBudget);
        if (tier) {
          const price = meal.price;
          if (tier.min !== undefined && price < tier.min) return false;
          if (tier.max !== undefined && price > tier.max) return false;
        }
      }

      return true;
    });
  }, [meals, selectedCampus, selectedCategory, selectedBudget]);

  const resetFilters = () => {
    setSelectedBudget(null);
    setSelectedCategory(null);
  };

  return (
    <div className="pb-24 pt-6 px-4 md:px-8 max-w-6xl mx-auto animate-fade-in-up">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
          Where can you eat today?
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Find affordable student-approved food options near your campus.
        </p>
      </div>

      {/* Dominant Search Input */}
      <div 
        onClick={() => navigate('/search')}
        className="flex items-center gap-3 bg-white border border-gray-200 pl-4 pr-2.5 py-3 rounded-xl shadow-xs cursor-pointer hover:border-gray-300 transition-colors mb-8"
      >
        <SearchIcon size={18} className="text-orange-500 shrink-0" />
        <span className="text-sm font-medium flex-1 text-left text-gray-400">Search meals, stalls, siomai, bacsilog...</span>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs">
          Search
        </button>
      </div>

      {/* Campus Selector Row */}
      <section className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Select University
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {CAMPUSES.map((campus) => {
            const style = getCampusStyle(campus.id);
            const isSelected = selectedCampus === campus.id;
            return (
              <button
                key={campus.id}
                onClick={() => setSelectedCampus(campus.id)}
                className={`px-4.5 py-2 rounded-lg font-bold text-xs shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? `${style.bg} ${style.text} shadow-xs border ${style.border}`
                    : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                {campus.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid: Main Filters & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filters Panel */}
        <aside className="lg:col-span-1 bg-white border border-gray-200 p-5 rounded-2xl flex flex-col gap-6 static lg:sticky lg:top-24 shadow-xs z-10">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="font-semibold text-sm text-gray-800">
              Filter Options
            </span>
            {(selectedBudget || selectedCategory) && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FilterX size={12} /> Clear
              </button>
            )}
          </div>

          {/* Budget Limit Tiers */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Budget Limit
            </h3>
            <div className="flex flex-col gap-2">
              {BUDGET_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedBudget(selectedBudget === tier.id ? null : tier.id)}
                  className={`text-left px-4 py-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedBudget === tier.id
                      ? 'bg-orange-50 border-orange-200 text-orange-600 font-bold'
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food Type Categories */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Food Type
            </h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`text-left px-4 py-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-orange-50 border-orange-200 text-orange-600 font-bold'
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Share a Deal Button */}
          <button
            onClick={() => navigate(user ? '/profile' : '/login')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 hover:bg-orange-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <Plus size={14} /> Share a Budget Deal
          </button>
        </aside>

        {/* Right Food Grid */}
        <main className="lg:col-span-3">
          {/* Result Counts Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">
              {selectedCategory || 'Recommended'} Deals ({filteredMeals.length})
            </h3>
          </div>

          {/* Results Grid */}
          {filteredMeals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredMeals.map((meal) => (
                <div key={meal.id} className="animate-scale-in">
                  <FoodCard meal={meal} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-gray-200 shadow-xs">
              <div className="bg-orange-50 text-orange-500 p-3.5 rounded-full mb-4">
                <FilterX size={28} />
              </div>
              <h4 className="font-semibold text-base text-gray-900 mb-1">
                No Meals Match Your Budget
              </h4>
              <p className="text-xs text-gray-400 max-w-xs mb-6">
                Try setting a wider budget range or check a different campus location.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => navigate(user ? '/profile' : '/login')}
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Share a Deal
                </button>
              </div>
            </div>
          )}

          {/* Live Activity Ticker */}
          <section className="mt-12 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <span className="font-semibold text-xs text-gray-700 flex items-center gap-1.5">
                <RefreshCw size={13} className="text-orange-500 animate-pulse-slow" />
                Live Student Contributions
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Community Sourced
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {contributions.map((c) => (
                <div key={c.id} className="flex gap-3 items-start text-xs">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {c.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">
                      <span className="font-semibold text-gray-900">{c.userName}</span>{' '}
                      {c.type === 'price_update' ? 'verified a price update' : 'wrote a review'}:
                    </p>
                    <p className="text-gray-400 italic mt-0.5">"{c.details}"</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
