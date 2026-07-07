import React, { useState } from 'react';
import { X } from 'lucide-react';

export const PriceUpdateModal = ({ isOpen, onClose, mealName, onSubmit }) => {
  const [newPrice, setNewPrice] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPrice);
    setNewPrice('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto flex items-start justify-center p-4 md:p-10">
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-gray-100 shadow-2xl relative z-10 animate-scale-in my-auto flex flex-col">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-5 text-left">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">Update Price</h3>
          <p className="text-xs font-bold text-orange-600 uppercase mt-1 tracking-wider truncate max-w-[280px]">
            {mealName}
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New Price (PHP)</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 focus-within:border-orange-500 focus-within:bg-white rounded-xl px-3.5 py-2.5 transition-all">
              <span className="font-bold text-orange-500 text-xs select-none">₱</span>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="e.g. 60"
                required
                min="1"
                className="bg-transparent border-none outline-none w-full text-xs font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer shadow-md shadow-orange-500/10 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
