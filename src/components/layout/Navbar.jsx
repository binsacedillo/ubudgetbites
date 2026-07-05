import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../ui/Logo';

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/search', label: 'Search', icon: <Search size={18} /> },
    { path: '/favorites', label: 'Favorites', icon: <Heart size={18} /> },
    { path: '/profile', label: 'Profile', icon: <User size={18} /> }
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-6 py-3.5 hidden md:flex items-center justify-between">
        <div 
          className="cursor-pointer select-none" 
          onClick={() => navigate('/')}
        >
          <Logo size={36} showTagline={true} />
        </div>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 py-1 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-orange-500 border-b-2 border-orange-500 font-semibold'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div>
          {user ? (
            <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => navigate('/profile')}>
              <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-gray-800 leading-none">🙂 {user.name.split(' ')[0]}</p>
                <p className="text-[9px] text-gray-400 leading-none mt-1 uppercase font-bold">{user.campus}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Student Login
            </button>
          )}
        </div>
      </header>

      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-4 py-3 flex md:hidden items-center justify-between">
        <div 
          className="cursor-pointer select-none" 
          onClick={() => navigate('/')}
        >
          <Logo size={28} showTagline={false} />
        </div>
        {user ? (
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1 cursor-pointer select-none"
          >
            <div className="w-6.5 h-6.5 rounded-full bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs uppercase">
              {user.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-gray-700">🙂 {user.name.split(' ')[0]}</span>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
          >
            Login
          </button>
        )}
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-6 py-2 flex md:hidden items-center justify-between shadow-md">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex-1"
          >
            {({ isActive }) => (
              <div className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors cursor-pointer ${
                isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
              }`}>
                <div className="p-0.5">
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};
