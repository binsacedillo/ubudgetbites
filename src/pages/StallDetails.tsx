import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Navigation, Heart, ExternalLink, UtensilsCrossed } from 'lucide-react';
import { dbService } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { RatingStars } from '../components/ui/RatingStars';
import { getCampusStyle } from '../utils/theme';

export const StallDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, toggleFavorite, isFavorite } = useAuth();
  const { showToast } = useToast();

  const stall = useMemo(() => dbService.getStallById(id || ''), [id]);
  const campus = useMemo(() => stall ? dbService.getCampusById(stall.campusId) : null, [stall]);
  
  // Load meals sold at this stall
  const menuItems = useMemo(() => {
    if (!stall) return [];
    const allMeals = dbService.getMeals();
    return allMeals.filter((m) => m.stallId === stall.id);
  }, [stall]);

  const favorited = isFavorite(stall?.id || '', 'stall');

  if (!stall) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Stall not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded cursor-pointer">
          Back Home
        </button>
      </div>
    );
  }

  const handleFavoriteClick = () => {
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
    <div className="pb-24 pt-4 px-4 md:px-8 max-w-4xl mx-auto animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 mb-6 uppercase tracking-wider cursor-pointer"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header Profile Cover */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs mb-8">
        <div className="relative h-56 md:h-72 w-full bg-gray-50">
          <img src={stall.image} alt={stall.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          
          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-4 right-4 p-3 rounded-full border shadow-xs transition-all cursor-pointer ${
              favorited
                ? 'bg-rose-500 border-rose-500 text-white scale-105'
                : 'bg-white/90 hover:bg-white border-gray-200 text-gray-500 hover:text-rose-500'
            }`}
          >
            <Heart size={18} className={favorited ? 'fill-current' : ''} />
          </button>

          {/* Title on Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            {campus && (
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black tracking-wide uppercase border mb-2 inline-block ${getCampusStyle(stall.campusId).badge}`}>
                Near {campus.name}
              </span>
            )}
            <h1 className="text-xl md:text-3xl font-bold tracking-tight leading-tight mt-1">
              {stall.name}
            </h1>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6">
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-6">
            {stall.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 pt-5">
            {/* Badges list */}
            <div className="flex flex-wrap gap-5 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <RatingStars rating={stall.rating} size={13} />
                <span className="text-slate-900 font-bold">{stall.rating}</span>
                <span className="text-[10px] text-gray-400">({stall.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-orange-500" />
                <span>{stall.distance}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{stall.openingHours}</span>
              </div>
            </div>

            {/* Google Maps anchor link */}
            <a
              href={stall.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-lg bg-slate-900 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Navigation size={13} />
              Open in Maps
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Menu / Deals Section */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
          <UtensilsCrossed size={16} className="text-orange-500" />
          Budget Menu & Deals
        </h2>

        {menuItems.length > 0 ? (
          <div className="flex flex-col gap-4">
            {menuItems.map((meal) => (
              <div
                key={meal.id}
                onClick={() => navigate(`/meal/${meal.id}`)}
                className="bg-white border border-gray-200 rounded-xl p-3.5 flex gap-4 hover:border-orange-300 transition-colors shadow-xs cursor-pointer group"
              >
                {/* Visual */}
                <div className="w-18 h-18 md:w-20 md:h-20 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                  <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-0.5">
                      <h3 className="font-semibold text-sm md:text-base text-gray-900 group-hover:text-orange-500 transition-colors leading-tight">
                        {meal.name}
                      </h3>
                      <div className="font-extrabold text-sm md:text-base text-orange-600 shrink-0">
                        <span className="font-extrabold text-xs">₱</span>
                        {meal.price}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-snug line-clamp-1">
                      {meal.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400">
                    <div className="flex items-center gap-1">
                      <RatingStars rating={meal.rating} size={10} />
                      <span className="text-gray-700 font-bold ml-1">{meal.rating}</span>
                    </div>
                    <span>Updated {new Date(meal.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-400 font-semibold">No menu items added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
