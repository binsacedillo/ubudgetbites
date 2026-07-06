import React from 'react';

/**
 * U-BudgetBites Brand Logo Component
 * Renders the custom map-and-pin logo with orbits and tagline.
 */
export const Logo = ({ 
  size = 40, 
  showText = true, 
  showTagline = true, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="pinGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="mapGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFBEB" /> {/* Warm light cream */}
            <stop offset="100%" stopColor="#F5E0B3" /> {/* Warm tan/sand */}
          </linearGradient>
        </defs>

        {/* Orbit Rings (Golden yellow) */}
        <ellipse 
          cx="60" 
          cy="60" 
          rx="52" 
          ry="15" 
          fill="none" 
          stroke="#D97706" 
          strokeWidth="1.8" 
          transform="rotate(-15 60 60)" 
          opacity="0.9"
        />
        <ellipse 
          cx="60" 
          cy="60" 
          rx="46" 
          ry="12" 
          fill="none" 
          stroke="#F59E0B" 
          strokeWidth="1.8" 
          transform="rotate(15 60 60)" 
          opacity="0.8"
        />

        {/* Perspective Folded Map */}
        <polygon 
          points="25,65 85,50 98,85 35,100" 
          fill="url(#mapGradient)" 
          stroke="#334155" 
          strokeWidth="2.2" 
        />
        
        {/* Map Sectors (Higher contrast fills) */}
        <polygon points="25,65 55,57 60,93 35,100" fill="#6EE7B7" /> {/* Solid Emerald Green sector */}
        <polygon points="55,57 85,50 98,85 60,93" fill="#FCD34D" /> {/* Solid Amber Gold sector */}
        
        {/* Map Road lines (Thicker and cleaner) */}
        <path d="M25,65 L98,85" stroke="#FFFFFF" strokeWidth="3.5" />
        <path d="M55,57 L60,93" stroke="#FFFFFF" strokeWidth="3.5" />
        
        {/* Small pin indicators on map */}
        <circle cx="42" cy="78" r="3.5" fill="#B91C1C" />
        <circle cx="80" cy="70" r="3.5" fill="#B91C1C" />

        {/* Main Red Map Pin */}
        <path 
          d="M60,18 C47.85,18 38,27.85 38,40 C38,56.5 60,82 60,82 C60,82 82,56.5 82,40 C82,27.85 72.15,18 60,18 Z" 
          fill="url(#pinGradient)" 
          stroke="#7F1D1D" 
          strokeWidth="0.8"
          filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.25))"
        />

        {/* White center circle of Red Pin */}
        <circle cx="60" cy="40" r="11" fill="#FFFFFF" />

        {/* Stylized Bird/Chick silhouette inside pin */}
        <path 
          d="M54,41.5 
             C54,38.5 56,36 59,36 
             C62,36 64,38.5 64,41.5 
             C64,42.5 63,43 62,43.5 
             L63,45.5 L61,45 L59,46 
             L59,44 C56.5,44 54,43 54,41.5 Z" 
          fill="#991B1B" 
        />
        
        {/* Bird Beak */}
        <polygon points="63.5,40.5 67,41.5 63.5,42.5" fill="#991B1B" />
      </svg>

      {/* Brand Text and Tagline */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-gray-900 tracking-tight leading-none text-base md:text-lg italic font-sans">
            <span className="text-[#991B1B]">u-</span>budgetbites
          </span>
          {showTagline && (
            <span className="text-[10px] text-orange-600 font-bold tracking-wide mt-1">
              Eat Smart, Spend Less.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
