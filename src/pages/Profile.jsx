import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { LogOut, Award, PlusCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { dbService } from '../services/db';
import { CATEGORIES, CAMPUSES } from '../constants';
import { getCampusStyle } from '../utils/theme';

const mealSchema = zod.object({
  name: zod.string().min(2, 'Meal name must be at least 2 characters'),
  price: zod.preprocess(
    (val) => Number(val),
    zod.number().min(1, 'Price must be greater than 0')
  ),
  description: zod.string().min(5, 'Please provide a short description (at least 5 characters)'),
  category: zod.string().min(1, 'Please select a food category'),
  stallId: zod.string().min(1, 'Please select a food stall'),
  campusId: zod.string().min(1, 'Please select a campus')
});

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [showAddMealModal, setShowAddMealModal] = useState(false);

  // Load user data
  const stalls = useMemo(() => dbService.getStalls(), []);
  const contributions = useMemo(() => {
    if (!user) return [];
    return dbService.getContributionsByUser(user.id);
  }, [user]);

  const campusData = useMemo(() => {
    if (!user) return null;
    return dbService.getCampusById(user.campus);
  }, [user]);

  const {
    register: mealRegister,
    handleSubmit: handleMealSubmit,
    reset: resetMealForm,
    formState: { errors: mealErrors }
  } = useForm({
    resolver: zodResolver(mealSchema)
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogoutClick = () => {
    logout();
    showToast('Successfully logged out!', 'info');
    navigate('/');
  };

  const onAddMeal = (data) => {
    const selectedStall = stalls.find(s => s.id === data.stallId);
    if (!selectedStall) {
      showToast('Stall not found', 'error');
      return;
    }

    // Unsplash food images map
    let fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80';
    if (data.category.toLowerCase().includes('rice')) {
      fallbackImage = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80';
    } else if (data.category.toLowerCase().includes('drink')) {
      fallbackImage = 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80';
    } else if (data.category.toLowerCase().includes('noodle')) {
      fallbackImage = 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80';
    } else if (data.category.toLowerCase().includes('sandwich') || data.category.toLowerCase().includes('bakery')) {
      fallbackImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80';
    }

    dbService.addMeal({
      name: data.name,
      price: data.price,
      description: data.description,
      category: data.category,
      stallId: data.stallId,
      stallName: selectedStall.name,
      campusId: data.campusId,
      image: fallbackImage
    });

    // Add contribution log
    dbService.addContribution({
      userId: user.id,
      userName: user.name,
      type: 'add_meal',
      details: `Added new budget deal: ${data.name} for ₱${data.price}`
    });

    resetMealForm();
    setShowAddMealModal(false);
    showToast('Budget meal successfully shared with the community!', 'success');
    
    // Refresh page / state
    navigate('/');
  };

  return (
    <div className="pb-24 pt-4 px-4 md:px-8 max-w-4xl mx-auto animate-fade-in-up">
      {/* Profile Header Cards */}
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center font-bold text-2xl uppercase">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              {user.name}
            </h1>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">{user.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-3">
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded border uppercase ${getCampusStyle(user.campus).badge}`}>
                {campusData?.name || user.campus} Campus
              </span>
              <span className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded border border-gray-200 uppercase">
                Student Advocate
              </span>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 hover:border-rose-500 hover:bg-rose-50 text-gray-600 hover:text-rose-600 font-semibold text-xs transition-colors cursor-pointer"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>

      {/* Grid: Contributions and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Stats Column */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Contribution Score */}
          <div className="bg-orange-500 text-white p-5 rounded-xl shadow-xs">
            <div className="flex items-start justify-between">
              <span className="font-extrabold text-[10px] text-orange-100 uppercase tracking-wider">
                Student Rank
              </span>
              <Award size={18} className="text-orange-200" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black leading-none">{user.contributionsCount || 0}</span>
              <span className="block text-xs font-semibold text-orange-50 mt-1">
                Contributions Points
              </span>
            </div>
            <p className="text-[10px] text-orange-100 leading-relaxed mt-4">
              Submit reviews and update meal prices to earn contributions points and help students dine cheap!
            </p>
          </div>

          {/* Quick CTA to Add Meal */}
          <button
            onClick={() => setShowAddMealModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 hover:bg-orange-500 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle size={15} />
            Share a Budget Deal
          </button>
        </div>

        {/* History Column */}
        <div className="md:col-span-2 bg-white border border-gray-200 p-5 rounded-xl shadow-xs">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-b border-gray-100 pb-3">
            My Contribution Log
          </h2>

          {contributions.length > 0 ? (
            <div className="flex flex-col gap-5">
              {contributions.map((c) => (
                <div key={c.id} className="flex gap-3 items-start text-xs">
                  <div className="bg-orange-50 text-orange-600 p-2 rounded-lg shrink-0 border border-orange-100">
                    <CheckCircle size={13} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold leading-normal">{c.details}</p>
                    <p className="text-gray-400 font-semibold mt-0.5">
                      {new Date(c.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">No activities logged yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Update prices or review meals around campus to help populate the dashboard.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SHARE NEW BUDGET DEAL MODAL */}
      {showAddMealModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowAddMealModal(false)} />
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-2xl relative z-10 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-gray-900 mb-1">Share Budget Deal</h3>
            <p className="text-xs text-gray-400 font-semibold mb-5 leading-normal">
              Contribute a local meal Deal so students can find it instantly.
            </p>

            <form onSubmit={handleMealSubmit(onAddMeal)} className="flex flex-col gap-4">
              {/* Meal Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Meal / Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pork Siomai Rice"
                  {...mealRegister('name')}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-orange-400 transition-colors"
                />
                {mealErrors.name && (
                  <span className="text-[10px] text-rose-500 font-bold">{mealErrors.name.message}</span>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Price (PHP)</label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="font-bold text-orange-500 text-xs">₱</span>
                  <input
                    type="number"
                    placeholder="e.g. 55"
                    {...mealRegister('price')}
                    className="bg-transparent border-none outline-none w-full text-xs font-semibold text-gray-800"
                  />
                </div>
                {mealErrors.price && (
                  <span className="text-[10px] text-rose-500 font-bold">{mealErrors.price.message}</span>
                )}
              </div>

              {/* Campus Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Campus Proximity</label>
                <select
                  {...mealRegister('campusId')}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-orange-400 cursor-pointer"
                >
                  <option value="">Select Campus...</option>
                  {CAMPUSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {mealErrors.campusId && (
                  <span className="text-[10px] text-rose-500 font-bold">{mealErrors.campusId.message}</span>
                )}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Food Category</label>
                <select
                  {...mealRegister('category')}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-orange-400 cursor-pointer"
                >
                  <option value="">Select Category...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {mealErrors.category && (
                  <span className="text-[10px] text-rose-500 font-bold">{mealErrors.category.message}</span>
                )}
              </div>

              {/* Food Stall */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Food Stall</label>
                <select
                  {...mealRegister('stallId')}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-orange-400 cursor-pointer"
                >
                  <option value="">Select Food Stall...</option>
                  {stalls.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({CAMPUSES.find(c => c.id === s.campusId)?.name})
                    </option>
                  ))}
                </select>
                {mealErrors.stallId && (
                  <span className="text-[10px] text-rose-500 font-bold">{mealErrors.stallId.message}</span>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Short description</label>
                <textarea
                  placeholder="Where is the stall? What's inside the meal? e.g., 4 pieces of pork siomai, sweet chili sauce, Asturias side"
                  rows={2}
                  {...mealRegister('description')}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-orange-400 resize-none"
                />
                {mealErrors.description && (
                  <span className="text-[10px] text-rose-500 font-bold">{mealErrors.description.message}</span>
                )}
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMealModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-orange-500 text-white font-bold text-xs cursor-pointer"
                >
                  Add Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
