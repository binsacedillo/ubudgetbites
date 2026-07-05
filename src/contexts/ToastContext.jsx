import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-[110] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 md:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto animate-scale-in transition-all duration-300 ${
              t.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : t.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {t.type === 'success' && <CheckCircle size={20} className="text-emerald-500 shrink-0" />}
            {t.type === 'error' && <AlertCircle size={20} className="text-rose-500 shrink-0" />}
            {t.type === 'info' && <Info size={20} className="text-amber-500 shrink-0" />}
            
            <p className="text-sm font-medium leading-tight flex-1">{t.message}</p>
            
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
