import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RatingStars } from './RatingStars';

export const ReviewModal = ({ isOpen, onClose, mealName, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [budgetFeedback, setBudgetFeedback] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment, budgetFeedback });
    setRating(5);
    setComment('');
    setBudgetFeedback('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto flex items-start justify-center p-4 md:p-10">
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="bg-white rounded-3xl p-8 w-full max-w-md border border-gray-100 shadow-2xl relative z-10 animate-scale-in my-auto flex flex-col">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-5 text-left">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">Write a Review</h3>
          <p className="text-xs font-bold text-orange-600 uppercase mt-1 tracking-wider truncate max-w-[340px]">
            {mealName}
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
          {/* Star Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Rating</label>
            <div className="mt-0.5">
              <RatingStars
                rating={rating}
                interactive
                size={20}
                onChange={setRating}
              />
            </div>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Review Details</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How does it taste? Is the portion big? Is it clean?"
              rows={3}
              required
              className="bg-gray-50 border border-gray-100 focus:border-orange-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 placeholder-gray-400 resize-none outline-none transition-all"
            />
          </div>

          {/* Price Feedback tag */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Price Check Tag (Optional)
            </label>
            <input
              type="text"
              value={budgetFeedback}
              onChange={(e) => setBudgetFeedback(e.target.value)}
              placeholder="e.g. Still ₱55 as of June"
              className="bg-gray-50 border border-gray-100 focus:border-orange-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none transition-all"
            />
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
