import { useNavigate } from 'react-router-dom';
import { Heart, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { RatingStars } from '../ui/RatingStars';
import { dbService } from '../../services/db';
import { getCampusStyle } from '../../utils/theme';

export const FoodCard = ({ meal }) => {
  const navigate = useNavigate();
  const { user, toggleFavorite, isFavorite } = useAuth();
  const { showToast } = useToast();
  
  const favorited = isFavorite(meal.id, 'meal');
  const stall = dbService.getStallById(meal.stallId);
  const campusName = dbService.getCampusById(meal.campusId)?.name || meal.campusId;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please login to save favorites!', 'info');
      navigate('/login');
      return;
    }
    toggleFavorite(meal.id, 'meal');
    showToast(
      favorited ? 'Removed from favorites' : 'Added to favorites!',
      favorited ? 'info' : 'success'
    );
  };

  const formattedDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={() => navigate(`/meal/${meal.id}`)}
      className="flat-card rounded-xl overflow-hidden flex flex-col h-full cursor-pointer group shadow-xs"
    >
      {/* Visual Header / Photo */}
      <div className="relative h-36 overflow-hidden bg-gray-50">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />

        {/* Favorite Action */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full border shadow-xs transition-all cursor-pointer ${
            favorited
              ? 'bg-rose-500 border-rose-500 text-white'
              : 'bg-white/90 hover:bg-white border-gray-100 text-gray-500 hover:text-rose-500'
          }`}
        >
          <Heart size={14} className={favorited ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate max-w-[120px]">
              {meal.stallName}
            </span>
            <span className="text-gray-300 text-[10px]">•</span>
            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getCampusStyle(meal.campusId).badge}`}>
              {campusName}
            </span>
          </div>
          
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm text-gray-900 leading-tight group-hover:text-orange-500 transition-colors line-clamp-1">
              {meal.name}
            </h3>
            <span className="font-extrabold text-sm text-orange-600 shrink-0">
              ₱{meal.price}
            </span>
          </div>

          {/* Distance Indicator */}
          {stall && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400 mb-3">
              <Clock size={11} />
              <span>{stall.distance}</span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-2.5">
          <div className="flex items-center gap-1">
            <RatingStars rating={meal.rating} size={11} />
            <span className="text-[11px] font-bold text-gray-700 ml-1">{meal.rating}</span>
            <span className="text-[10px] text-gray-400">({meal.reviewsCount})</span>
          </div>
          
          <div className="flex items-center gap-1 text-[9px] text-gray-400 font-semibold bg-gray-50 px-1.5 py-0.5 rounded">
            <AlertCircle size={9} className="text-gray-400 shrink-0" />
            <span>{formattedDate(meal.lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
