import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { RatingStars } from '../ui/RatingStars';
import { dbService } from '../../services/db';
import { getCampusStyle } from '../../utils/theme';

export const StallCard = ({ stall }) => {
  const navigate = useNavigate();
  const { user, toggleFavorite, isFavorite } = useAuth();
  const { showToast } = useToast();

  const favorited = isFavorite(stall.id, 'stall');
  const campus = dbService.getCampusById(stall.campusId);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please login to save favorites!', 'info');
      navigate('/login');
      return;
    }
    toggleFavorite(stall.id, 'stall');
    showToast(
      favorited ? 'Removed from favorites' : 'Added to favorites!',
      favorited ? 'info' : 'success'
    );
  };

  return (
    <div
      onClick={() => navigate(`/stall/${stall.id}`)}
      className="flat-card rounded-xl overflow-hidden flex flex-col md:flex-row h-full cursor-pointer group shadow-xs border border-gray-100"
    >
      {/* Photo (fixed left side on desktop, top on mobile) */}
      <div className="relative w-full md:w-44 h-40 md:h-full shrink-0 bg-gray-50">
        <img
          src={stall.image}
          alt={stall.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />

        {/* Favorite Button */}
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

        {/* Campus Proximity Tag */}
        {campus && (
          <div className={`absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-xs border ${getCampusStyle(stall.campusId).badge}`}>
            {campus.name}
          </div>
        )}
      </div>

      {/* Details Box */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Title */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-base text-gray-900 group-hover:text-orange-500 transition-colors leading-tight">
              {stall.name}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2.5">
            <RatingStars rating={stall.rating} size={11} />
            <span className="text-[11px] font-bold text-gray-700 ml-1">{stall.rating}</span>
            <span className="text-[10px] text-gray-400">({stall.reviewsCount} reviews)</span>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
            {stall.description}
          </p>
        </div>

        {/* Footer badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-gray-50">
          <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-orange-500" />
              <span>{stall.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{stall.openingHours}</span>
            </div>
          </div>

          <span className="text-[11px] font-bold text-orange-500 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Menu <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
};
