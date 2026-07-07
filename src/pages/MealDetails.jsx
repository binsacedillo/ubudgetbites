import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Heart, MessageSquare, Plus, RefreshCw, Check } from 'lucide-react';
import { dbService } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { RatingStars } from '../components/ui/RatingStars';
import { getCampusStyle } from '../utils/theme';
import { PriceUpdateModal } from '../components/ui/PriceUpdateModal';
import { ReviewModal } from '../components/ui/ReviewModal';

export const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavorite, isFavorite } = useAuth();
  const { showToast } = useToast();

  // Load from dbService
  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form modals state
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const loadMealData = async () => {
      setLoading(true);
      try {
        const fetchedMeal = await dbService.getMealById(id || '');
        if (fetchedMeal) {
          setMeal(fetchedMeal);
          const [fetchedReviews, fetchedStall] = await Promise.all([
            dbService.getReviews(fetchedMeal.id, 'meal'),
            dbService.getStallById(fetchedMeal.stallId)
          ]);
          setReviews(fetchedReviews);
          setStall(fetchedStall);
        }
      } catch (err) {
        console.error("Error loading meal details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMealData();
  }, [id]);

  const favorited = isFavorite(meal?.id || '', 'meal');
  const campus = useMemo(() => meal ? dbService.getCampusById(meal.campusId) : null, [meal]);

  if (loading) {
    return (
      <div className="pb-24 pt-4 px-4 md:px-8 max-w-4xl mx-auto text-center shimmer rounded-2xl h-96 mt-6" />
    );
  }

  if (!meal) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Meal not found</h2>
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
    toggleFavorite(meal.id, 'meal');
    showToast(
      favorited ? 'Removed from favorites' : 'Added to favorites!',
      favorited ? 'info' : 'success'
    );
  };

  const handlePriceUpdate = async (priceVal) => {
    if (!user) {
      showToast('Please login to submit price updates!', 'info');
      navigate('/login');
      return;
    }

    const priceNum = parseFloat(priceVal);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    const updated = await dbService.updateMealPrice(meal.id, priceNum, user.id, user.name);
    if (updated) {
      setMeal({ ...updated });
      setShowPriceModal(false);
      showToast(`Updated price to ₱${priceNum}!`, 'success');
    }
  };

  const handleReviewSubmit = async ({ rating, comment, budgetFeedback }) => {
    if (!user) {
      showToast('Please login to submit reviews!', 'info');
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      showToast('Please write a comment', 'error');
      return;
    }

    await dbService.addReview({
      userId: user.id,
      userName: user.name,
      targetId: meal.id,
      targetType: 'meal',
      rating,
      comment,
      budgetFeedback: budgetFeedback || `Verified ₱${meal.price} as of ${new Date().toLocaleDateString('en-US', { month: 'short' })}`
    });

    // Refresh reviews and meal rating
    const [fetchedReviews, updatedMeal] = await Promise.all([
      dbService.getReviews(meal.id, 'meal'),
      dbService.getMealById(meal.id)
    ]);
    
    setReviews(fetchedReviews);
    if (updatedMeal) {
      setMeal(updatedMeal);
    }

    setShowReviewModal(false);
    showToast('Thank you for contributing a review!', 'success');
  };

  const formattedDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="pb-24 pt-4 px-4 md:px-8 max-w-4xl mx-auto animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 mb-6 uppercase tracking-wider cursor-pointer"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Main Grid Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs mb-8">
        <div className="relative h-64 md:h-96 w-full bg-gray-50">
          <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
          
          {/* Favorite Trigger */}
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

          {/* Campus Tag */}
          {campus && (
            <div className={`absolute bottom-4 left-4 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-xs border ${getCampusStyle(meal.campusId).badge}`}>
              {campus.name}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                {meal.category}
              </p>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight leading-tight">
                {meal.name}
              </h1>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                Sold by:{' '}
                <Link to={`/stall/${meal.stallId}`} className="text-orange-500 hover:underline font-bold">
                  {meal.stallName}
                </Link>
              </p>
            </div>

            {/* Price Presentation */}
            <div className="bg-orange-50 border border-orange-100 px-4 py-2.5 rounded-xl flex flex-col items-center md:items-end justify-center shrink-0">
              <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider">
                Student Price
              </span>
              <div className="flex items-baseline gap-0.5 text-xl font-black text-orange-600 leading-none mt-0.5">
                <span className="text-xs font-extrabold">₱</span>
                <span>{meal.price}</span>
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-6">
            {meal.description}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-b border-gray-50 py-5 mb-6">
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Walking Proximity
              </span>
              <span className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-1 mt-1">
                <Clock size={13} className="text-orange-500" />
                {stall?.distance || 'N/A'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Average Rating
              </span>
              <span className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-1 mt-1">
                <RatingStars rating={meal.rating} size={11} />
                <span className="ml-1 text-slate-800 font-bold">{meal.rating}</span>
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Last Verified
              </span>
              <span className="text-[10px] font-bold text-gray-500 block mt-1.5 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 max-w-max">
                {formattedDate(meal.lastUpdated)}
              </span>
            </div>
          </div>

          {/* Verification CTA section */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (!user) {
                  showToast('Please login to update prices!', 'info');
                  navigate('/login');
                  return;
                }
                setShowPriceModal(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-orange-500 hover:bg-orange-50 text-orange-600 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              Update Price
            </button>
            
            <button
              onClick={() => {
                if (!user) {
                  showToast('Please login to contribute reviews!', 'info');
                  navigate('/login');
                  return;
                }
                setShowReviewModal(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Write Review
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
          <MessageSquare size={16} className="text-orange-500" />
          Student Reviews ({reviews.length})
        </h2>

        {reviews.length > 0 ? (
          <div className="flex flex-col gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-50 pb-5 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7.5 h-7.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {r.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{r.userName}</p>
                      <p className="text-[9px] text-gray-400 font-semibold">{formattedDate(r.createdAt)}</p>
                    </div>
                  </div>
                  <RatingStars rating={r.rating} size={10} />
                </div>
                
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed pl-10">
                  {r.comment}
                </p>
                
                {r.budgetFeedback && (
                  <div className="mt-2.5 ml-10 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100/50">
                    <Check size={9} className="stroke-[3]" />
                    <span>{r.budgetFeedback}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 font-semibold">No reviews yet. Be the first to leave a review!</p>
          </div>
        )}
      </div>
      </div> {/* Closes animate-fade-in-up container wrapper */}

      {/* PRICE UPDATE DIALOG MODAL */}
      <PriceUpdateModal
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        mealName={meal.name}
        onSubmit={handlePriceUpdate}
      />

      {/* SUBMIT REVIEW DIALOG MODAL */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        mealName={meal.name}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};
