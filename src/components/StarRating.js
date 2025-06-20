import React, { useState } from "react";
import { Star } from "lucide-react";

// StarRating Component with enhanced design
const StarRating = ({ rating, size = 'sm', interactive = false, onRate }) => {
  const starSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const [hoveredStar, setHoveredStar] = useState(null);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHoveredStar(star)}
          onMouseLeave={() => interactive && setHoveredStar(null)}
          className={`transition-all duration-200 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <Star
            size={starSize}
            className={`transition-colors duration-200 ${
              (hoveredStar ? star <= hoveredStar : star <= rating)
                ? 'fill-amber-400 text-amber-400 drop-shadow-lg'
                : 'text-gray-600 hover:text-gray-500'
            }`}
          />
        </button>
      ))}
    </div> // ✅ This was missing
  );
};

export default StarRating;
