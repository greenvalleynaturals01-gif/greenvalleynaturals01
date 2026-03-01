'use client';

import React, { useState } from 'react';
import ReviewCard from './ReviewCard';
import { ChevronDown } from 'lucide-react';

const ReviewList = ({ reviews = [], isLoading = false, onDeleteReview = null, onEditReview = null, currentUserId = null, backendUrl = '', token = '' }) => {
  const [showMore, setShowMore] = useState(false);

  const initialDisplayCount = 3;
  const displayedReviews = showMore ? reviews : reviews.slice(0, initialDisplayCount);
  const hasMoreReviews = reviews.length > initialDisplayCount;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-5 h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Reviews List */}
      {displayedReviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          onDelete={onDeleteReview}
          onEdit={onEditReview}
          currentUserId={currentUserId}
          backendUrl={backendUrl}
          token={token}
        />
      ))}

      {/* See More Button */}
      {hasMoreReviews && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group"
        >
          {showMore ? (
            <>
              Show Less
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform rotate-180" />
            </>
          ) : (
            <>
              See All Reviews ({reviews.length})
              <ChevronDown className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ReviewList;
