import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { MealDetails } from './pages/MealDetails';
import { StallDetails } from './pages/StallDetails';
import { Favorites } from './pages/Favorites';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-[#fafafa]">
            {/* Top Bar for Desktop, top/bottom navigation for Mobile */}
            <Navbar />
            
            {/* Page content */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/meal/:id" element={<MealDetails />} />
                <Route path="/stall/:id" element={<StallDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>

            {/* Sticky footer for visual polish (Desktop only) */}
            <footer className="hidden md:block py-6 bg-white border-t border-gray-100 mt-auto">
              <div className="max-w-6xl mx-auto px-6 text-center text-xs text-gray-400 font-semibold uppercase tracking-wider">
                © {new Date().getFullYear()} U-BudgetBites — Empowering Manila Students in the U-Belt
              </div>
            </footer>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
