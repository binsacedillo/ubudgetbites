import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { X, PlusCircle } from 'lucide-react';
import { CAMPUSES, CATEGORIES } from '../../constants';

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

export const ShareDealModal = ({ isOpen, onClose, stalls, onSubmit, isAdding }) => {
  const [imageFile, setImageFile] = useState(null);

  const {
    register: mealRegister,
    handleSubmit: handleMealSubmit,
    reset: resetMealForm,
    formState: { errors: mealErrors }
  } = useForm({
    resolver: zodResolver(mealSchema)
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data, imageFile);
    resetMealForm();
    setImageFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto flex items-start justify-center p-4 md:p-10">
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg border border-gray-100 shadow-2xl relative z-10 animate-scale-in my-auto flex flex-col">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-6 text-left">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">Share Budget Deal</h3>
          <p className="text-xs text-gray-400 font-semibold mt-1 leading-normal">
            Contribute a local meal deal so students can find it instantly.
          </p>
        </div>

        <form onSubmit={handleMealSubmit(handleFormSubmit)} className="flex flex-col gap-4.5 pr-0.5">
          {/* Meal Name */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Meal / Item Name</label>
            <input
              type="text"
              placeholder="e.g. Pork Siomai Rice"
              {...mealRegister('name')}
              className="bg-gray-50 border border-gray-100 focus:border-orange-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 outline-none transition-all"
            />
            {mealErrors.name && (
              <span className="text-[10px] text-rose-500 font-bold">{mealErrors.name.message}</span>
            )}
          </div>

          {/* Price & Category in a Grid */}
          <div className="grid grid-cols-2 gap-4 text-left">
            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price (PHP)</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 focus-within:border-orange-500 focus-within:bg-white rounded-xl px-3.5 py-2.5 transition-all">
                <span className="font-bold text-orange-500 text-xs select-none">₱</span>
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

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Food Category</label>
              <select
                {...mealRegister('category')}
                className="bg-gray-50 border border-gray-100 focus:border-orange-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none transition-all cursor-pointer"
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
          </div>

          {/* Campus Proximity & Food Stall in a Grid */}
          <div className="grid grid-cols-2 gap-4 text-left">
            {/* Campus Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campus Proximity</label>
              <select
                {...mealRegister('campusId')}
                className="bg-gray-50 border border-gray-100 focus:border-orange-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none transition-all cursor-pointer"
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

            {/* Food Stall */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Food Stall</label>
              <select
                {...mealRegister('stallId')}
                className="bg-gray-50 border border-gray-100 focus:border-orange-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none transition-all cursor-pointer"
              >
                <option value="">Select Stall...</option>
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
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Short description</label>
            <textarea
              placeholder="Where is the stall? What's inside the meal? e.g., 4 pieces of pork siomai, sweet chili sauce, Asturias side"
              rows={2}
              {...mealRegister('description')}
              className="bg-gray-50 border border-gray-100 focus:border-orange-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 outline-none transition-all resize-none"
            />
            {mealErrors.description && (
              <span className="text-[10px] text-rose-500 font-bold">{mealErrors.description.message}</span>
            )}
          </div>

          {/* Custom Image picker */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Food / Menu Image (Optional)</label>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 border-dashed rounded-xl p-3 cursor-pointer hover:bg-orange-50/20 hover:border-orange-200 transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <PlusCircle size={16} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-700 truncate max-w-[280px]">
                  {imageFile ? imageFile.name : 'Choose image...'}
                </p>
                <p className="text-[10px] text-gray-400 font-semibold">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3.5 mt-3 pt-3 border-t border-gray-50">
            <button
              type="button"
              disabled={isAdding}
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer shadow-md shadow-orange-500/10 transition-colors disabled:opacity-50"
            >
              {isAdding ? 'Sharing Deal...' : 'Add Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
