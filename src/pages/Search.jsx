import { useState, useMemo } from 'react';
import { Search as SearchIcon, MapPin, Store, Utensils, XCircle } from 'lucide-react';
import { dbService } from '../services/db';
import { CAMPUSES } from '../constants';
import { FoodCard } from '../components/cards/FoodCard';
import { StallCard } from '../components/cards/StallCard';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [campusFilter, setCampusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('meals');

  const meals = useMemo(() => dbService.getMeals(), []);
  const stalls = useMemo(() => dbService.getStalls(), []);

  // Filtered Meals
  const searchedMeals = useMemo(() => {
    return meals.filter((m) => {
      const matchesQuery = 
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.stallName.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase()) ||
        m.category.toLowerCase().includes(query.toLowerCase());
      
      const matchesCampus = campusFilter === 'all' || m.campusId === campusFilter;

      return matchesQuery && matchesCampus;
    });
  }, [meals, query, campusFilter]);

  // Filtered Stalls
  const searchedStalls = useMemo(() => {
    return stalls.filter((s) => {
      const matchesQuery =
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.categories.some((c) => c.toLowerCase().includes(query.toLowerCase()));

      const matchesCampus = campusFilter === 'all' || s.campusId === campusFilter;

      return matchesQuery && matchesCampus;
    });
  }, [stalls, query, campusFilter]);

  return (
    <div className="pb-24 pt-4 px-4 md:px-8 max-w-6xl mx-auto animate-fade-in-up">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
          Explore Budget Eats
        </h1>
        <p className="text-sm text-gray-500">
          Find student stalls and menus across the University Belt.
        </p>
      </div>

      {/* Inputs panel */}
      <div className="flex flex-col md:flex-row gap-4 bg-white border border-gray-100 p-4 rounded-2xl shadow-xs mb-8">
        {/* Text Input */}
        <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <SearchIcon size={18} className="text-orange-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by food name, siomai, bacsilog, stall..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-semibold text-gray-800 placeholder-gray-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <XCircle size={16} />
            </button>
          )}
        </div>

        {/* Campus dropdown */}
        <div className="w-full md:w-64 flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <MapPin size={18} className="text-orange-500 shrink-0" />
          <select
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-semibold text-gray-700 cursor-pointer"
          >
            <option value="all">All U-Belt Campuses</option>
            {CAMPUSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.fullName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-gray-100 mb-6">
        <button
          onClick={() => setActiveTab('meals')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'meals'
              ? 'border-orange-500 text-orange-500'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Utensils size={16} />
          Meals ({searchedMeals.length})
        </button>
        <button
          onClick={() => setActiveTab('stalls')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'stalls'
              ? 'border-orange-500 text-orange-500'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Store size={16} />
          Food Stalls ({searchedStalls.length})
        </button>
      </div>

      {/* Render Listings */}
      {activeTab === 'meals' ? (
        searchedMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchedMeals.map((meal) => (
              <div key={meal.id} className="animate-scale-in">
                <FoodCard meal={meal} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm font-semibold">No meals found matching your search term.</p>
          </div>
        )
      ) : (
        searchedStalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchedStalls.map((stall) => (
              <div key={stall.id} className="animate-scale-in">
                <StallCard stall={stall} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm font-semibold">No food stalls found matching your search term.</p>
          </div>
        )
      )}
    </div>
  );
};
