import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 16,
  onChange,
  interactive = false
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const currentRating = hoverRating !== null ? hoverRating : rating;
        
        let isFilled = false;
        let isHalf = false;

        if (starValue <= currentRating) {
          isFilled = true;
        } else if (starValue - 0.5 <= currentRating) {
          isHalf = true;
        }

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform focus:outline-none' : ''
            } text-amber-400`}
            style={{ width: size, height: size }}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
