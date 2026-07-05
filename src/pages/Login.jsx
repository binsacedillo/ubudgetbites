import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Mail, User, GraduationCap, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { CAMPUSES } from '../constants';
import { Logo } from '../components/ui/Logo';

const loginSchema = zod.object({
  email: zod.string().email('Please enter a valid student email address')
});

const registerSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters long'),
  email: zod.string().email('Please enter a valid email address'),
  campus: zod.string().min(1, 'Please select your campus')
});

export const Login = () => {
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const { showToast } = useToast();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // If already logged in, redirect home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const {
    register: registerField,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onLogin = (data) => {
    const success = login(data.email);
    if (success) {
      showToast('Successfully logged in!', 'success');
      navigate(-1); // Back to previous page
    } else {
      showToast('Could not log in, try again', 'error');
    }
  };

  const onRegister = (data) => {
    register(data.name, data.email, data.campus);
    showToast('Registration successful! Welcome!', 'success');
    navigate(-1); // Back to previous page
  };

  return (
    <div className="pb-24 pt-12 px-4 flex items-center justify-center min-h-[80vh] animate-fade-in-up">
      <div className="max-w-md w-full bg-white border border-gray-100 p-8 rounded-3xl shadow-lg relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-500" />
        
        <div className="text-center mb-6 flex flex-col items-center">
          <Logo size={56} showText={false} className="mb-3.5" />
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {isRegisterMode ? 'Student Registration' : 'Student Login'}
          </h1>
          <p className="text-[10px] text-orange-600 font-extrabold uppercase tracking-widest mt-1">
            Eat Smart, Spend Less.
          </p>
        </div>

        {/* Login Form */}
        {!isRegisterMode ? (
          <form onSubmit={handleLoginSubmit(onLogin)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Student Email</label>
              <div className={`flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3 transition-colors ${
                loginErrors.email ? 'border-rose-300 bg-rose-50/20' : 'border-gray-100 focus-within:border-amber-400'
              }`}>
                <Mail size={16} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  placeholder="juan@ust.edu.ph"
                  {...loginRegister('email')}
                  className="bg-transparent border-none outline-none w-full text-sm font-semibold text-gray-800 placeholder-gray-400"
                />
              </div>
              {loginErrors.email && (
                <span className="text-xs text-rose-500 font-semibold">{loginErrors.email.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md shadow-amber-500/10 hover:scale-[1.01] transition-transform cursor-pointer"
            >
              Sign In
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit(onRegister)} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
              <div className={`flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3 transition-colors ${
                registerErrors.name ? 'border-rose-300 bg-rose-50/20' : 'border-gray-100 focus-within:border-amber-400'
              }`}>
                <User size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Juan Dela Cruz"
                  {...registerField('name')}
                  className="bg-transparent border-none outline-none w-full text-sm font-semibold text-gray-800 placeholder-gray-400"
                />
              </div>
              {registerErrors.name && (
                <span className="text-xs text-rose-500 font-semibold">{registerErrors.name.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Student Email</label>
              <div className={`flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3 transition-colors ${
                registerErrors.email ? 'border-rose-300 bg-rose-50/20' : 'border-gray-100 focus-within:border-amber-400'
              }`}>
                <Mail size={16} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  placeholder="juan@ust.edu.ph"
                  {...registerField('email')}
                  className="bg-transparent border-none outline-none w-full text-sm font-semibold text-gray-800 placeholder-gray-400"
                />
              </div>
              {registerErrors.email && (
                <span className="text-xs text-rose-500 font-semibold">{registerErrors.email.message}</span>
              )}
            </div>

            {/* Campus */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Your University</label>
              <div className={`flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3 transition-colors ${
                registerErrors.campus ? 'border-rose-300 bg-rose-50/20' : 'border-gray-100 focus-within:border-amber-400'
              }`}>
                <GraduationCap size={16} className="text-gray-400 shrink-0" />
                <select
                  {...registerField('campus')}
                  className="bg-transparent border-none outline-none w-full text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  <option value="">Select Campus...</option>
                  {CAMPUSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {registerErrors.campus && (
                <span className="text-xs text-rose-500 font-semibold">{registerErrors.campus.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md shadow-amber-500/10 hover:scale-[1.01] transition-transform cursor-pointer"
            >
              Register & Start
            </button>
          </form>
        )}

        {/* Toggle Mode */}
        <div className="mt-6 text-center border-t border-gray-100 pt-5">
          <p className="text-sm text-gray-500">
            {isRegisterMode ? 'Already registered?' : 'First time using U-BudgetBites?'}
          </p>
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs font-extrabold text-amber-600 hover:text-amber-700 mt-1 cursor-pointer hover:underline uppercase tracking-wide"
          >
            {isRegisterMode ? 'Sign in with existing email' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};
