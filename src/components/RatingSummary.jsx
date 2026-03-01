'use client';

import React from 'react';

const RatingSummary = ({ reviews = [], averageRating = 0 }) => {
  // Calculate rating distribution
  const calculateRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    if (!reviews || reviews.length === 0) {
      return distribution;
    }

    reviews.forEach(review => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });

    return distribution;
  };

  const distribution = calculateRatingDistribution();
  const totalReviews = reviews.length || 0;

  const getRatingPercentage = (rating) => {
    if (totalReviews === 0) return 0;
    return Math.round((distribution[rating] / totalReviews) * 100);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-lg" style={{ color: i < rating ? '#2F6B3F' : '#E0E0E0' }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const ratingStars = [
    { stars: 5, percentage: getRatingPercentage(5), count: distribution[5] },
    { stars: 4, percentage: getRatingPercentage(4), count: distribution[4] },
    { stars: 3, percentage: getRatingPercentage(3), count: distribution[3] },
    { stars: 2, percentage: getRatingPercentage(2), count: distribution[2] },
    { stars: 1, percentage: getRatingPercentage(1), count: distribution[1] }
  ];

  if (totalReviews === 0) {
    return (
      <div className="mb-4 sm:mb-5 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-xs sm:text-sm text-gray-600">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="mb-4 sm:mb-5 p-4 sm:p-5 bg-white rounded-lg border border-gray-200">
      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-gray-200">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: '#2F6B3F' }}>
            {averageRating.toFixed(1)}
          </div>
          <div className="flex gap-0.5 mb-1">
            {renderStars(Math.round(averageRating))}
          </div>
          <p className="text-xs text-gray-600">Average Rating</p>
        </div>

        {/* Total Reviews Count */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl sm:text-3xl font-semibold mb-1" style={{ color: '#2F6B3F' }}>
            {totalReviews}
          </div>
          <p className="text-xs text-gray-600">
            {totalReviews === 1 ? 'Review' : 'Reviews'}
          </p>
        </div>

        {/* Positive Reviews Indicator */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-xl sm:text-2xl font-semibold mb-1" style={{ color: '#2F6B3F' }}>
            {getRatingPercentage(5) + getRatingPercentage(4)}%
          </div>
          <p className="text-xs text-gray-600">Positive Reviews</p>
          <p className="text-xs text-gray-500">(4★ & 5★)</p>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3">Rating Breakdown</h3>
        
        {ratingStars.map(({ stars, percentage, count }) => (
          <div key={stars} className="flex items-center gap-2">
            {/* Star Label */}
            <div className="w-10 flex items-center justify-end">
              <span className="text-xs font-medium text-gray-700">{stars}★</span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: '#2F6B3F'
                  }}
                />
              </div>
            </div>

            {/* Percentage and Count */}
            <div className="w-14 text-right">
              <span className="text-xs text-gray-600">{percentage}%</span>
              <span className="text-xs text-gray-500 ml-0.5">({count})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSummary;
