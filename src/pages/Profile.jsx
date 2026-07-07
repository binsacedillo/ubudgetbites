import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Award, CheckCircle, PlusCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { dbService } from '../services/db';
import { getCampusStyle } from '../utils/theme';
import { ShareDealModal } from '../components/ui/ShareDealModal';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [stalls, setStalls] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [campusData, setCampusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const [fetchedStalls, fetchedContribs] = await Promise.all([
          dbService.getStalls(),
          dbService.getContributionsByUser(user.id)
        ]);
        setStalls(fetchedStalls);
        setContributions(fetchedContribs);
        const campus = dbService.getCampusById(user.campus);
        setCampusData(campus);
      } catch (err) {
        console.error("Error loading profile details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="pb-24 pt-12 px-4 text-center max-w-sm mx-auto flex flex-col items-center justify-center shimmer rounded-2xl h-60 mt-6" />
    );
  }

  if (!user) {
    return null;
  }

  const handleLogoutClick = () => {
    logout();
    showToast('Successfully logged out!', 'info');
    navigate('/');
  };

  const onAddMeal = async (data, imageFile) => {
    const selectedStall = stalls.find(s => s.id === data.stallId);
    if (!selectedStall) {
      showToast('Stall not found', 'error');
      return;
    }

    setIsAdding(true);
    let finalImageUrl = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80';
    
    if (data.category.toLowerCase().includes('rice')) {
      finalImageUrl = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80';
    } else if (data.category.toLowerCase().includes('drink')) {
      finalImageUrl = 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80';
    } else if (data.category.toLowerCase().includes('noodle')) {
      finalImageUrl = 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80';
    } else if (data.category.toLowerCase().includes('sandwich') || data.category.toLowerCase().includes('bakery')) {
      finalImageUrl = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80';
    }

    try {
      if (imageFile) {
        const fileRef = ref(storage, `meals/${Date.now()}_${imageFile.name}`);
        const uploadSnap = await uploadBytes(fileRef, imageFile);
        finalImageUrl = await getDownloadURL(uploadSnap.ref);
      }

      await dbService.addMeal({
        name: data.name,
        price: data.price,
        description: data.description,
        category: data.category,
        stallId: data.stallId,
        stallName: selectedStall.name,
        campusId: data.campusId,
        image: finalImageUrl
      });

      await dbService.addContribution({
        userId: user.id,
        userName: user.name,
        type: 'add_meal',
        details: `Added new budget deal: ${data.name} for ₱${data.price}`
      });

      setShowAddMealModal(false);
      showToast('Budget meal successfully shared with the community!', 'success');

      // Refresh local list
      const fetchedContribs = await dbService.getContributionsByUser(user.id);
      setContributions(fetchedContribs);
    } catch (err) {
      console.error("Error adding budget meal:", err);
      showToast(err.message || 'Failed to upload and add meal', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
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
      </div> {/* Closes the animate-fade-in-up page wrapper */}
      
      {/* SHARE NEW BUDGET DEAL MODAL */}
      <ShareDealModal 
        isOpen={showAddMealModal}
        onClose={() => setShowAddMealModal(false)}
        stalls={stalls}
        onSubmit={onAddMeal}
        isAdding={isAdding}
      />
    </>
  );
};
