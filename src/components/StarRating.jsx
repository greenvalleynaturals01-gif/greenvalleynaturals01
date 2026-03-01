'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRatingChange = null, isInteractive = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }[size];

  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  };

  const displayRating = hoverRating || rating;

  // For non-interactive (posted reviews), use sharp text stars
  if (!isInteractive) {
    return (
      <div className="flex gap-0.5 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="text-lg leading-none"
            style={{
              color: star <= displayRating ? '#2F6B3F' : '#D3D3D3'
            }}
          >
            {star <= displayRating ? '★' : '☆'}
          </span>
        ))}
        {rating > 0 && (
          <span className="text-sm text-gray-600 ml-2">({rating.toFixed(1)})</span>
        )}
      </div>
    );
  }

  // Interactive version uses lucide Star
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => isInteractive && setHoverRating(star)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
          onClick={() => isInteractive && onRatingChange && onRatingChange(star)}
          className={`transition-all ${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            size={sizeMap[size]}
            className={`${sizeClass} transition-colors ${
              star <= displayRating
                ? 'text-white'
                : 'text-gray-300'
            }`}
            style={{
              fill: star <= displayRating ? '#2F6B3F' : 'none',
              color: star <= displayRating ? '#2F6B3F' : '#D3D3D3'
            }}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
