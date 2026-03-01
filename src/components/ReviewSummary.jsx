'use client';

import React from 'react';
import { Star } from 'lucide-react';

const ReviewSummary = ({ summary, rating, reviewCount, reviews = [] }) => {
  // If we have reviews but no summary, generate a dynamic one
  const getGeneratedSummary = () => {
    if (!reviews || reviews.length === 0) return null;

    const totalReviews = reviews.length;
    const averageRating = (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1);
    const positiveReviews = reviews.filter(r => r.rating >= 4).length;
    const positivePercentage = Math.round((positiveReviews / totalReviews) * 100);

    let generatedSummary = `Customers rate this product ${averageRating} out of 5 based on ${totalReviews} review${totalReviews !== 1 ? 's' : ''}. `;

    // Add sentiment-based observation
    if (positivePercentage >= 75) {
      generatedSummary += 'Most buyers appreciate the quality and value it offers. ';
    } else if (positivePercentage <= 25) {
      generatedSummary += `However, ${100 - positivePercentage}% of customers reported issues or concerns. `;
    } else if (positivePercentage >= 40) {
      generatedSummary += 'While many customers are satisfied, some have noted areas for improvement. ';
    } else {
      generatedSummary += 'Customers have shared mixed feedback about their experience. ';
    }

    // Add overall assessment
    generatedSummary += 'Overall, the product receives ';
    if (averageRating >= 4.5) {
      generatedSummary += 'strong positive feedback from customers.';
    } else if (averageRating >= 3.5) {
      generatedSummary += 'positive feedback with room for improvement.';
    } else if (averageRating >= 2.5) {
      generatedSummary += 'moderate feedback with noted concerns.';
    } else {
      generatedSummary += 'caution is recommended based on customer reviews.';
    }

    return generatedSummary;
  };

  // Use either provided summary or generated summary from reviews
  const displaySummary = summary || getGeneratedSummary();
  
  if (!displaySummary) {
    return null;
  }

  return (
    <div className="mb-6 p-5 bg-gradient-to-br from-[#2F6B3F]/10 to-[#2F6B3F]/5 rounded-lg border border-[#2F6B3F]/20 shadow-sm">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-[#2F6B3F] text-white px-3 py-1 rounded-full text-xs font-semibold">
          Review Summary
        </div>
        {rating !== undefined && (
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(rating) ? 'fill-[#2F6B3F] text-[#2F6B3F]' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Summary Text */}
      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
        {displaySummary}
      </p>

      {/* Decorative element */}
      <div className="mt-4 pt-3 border-t border-[#2F6B3F]/10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#2F6B3F]/40"></div>
        <span className="text-xs text-gray-500">
          Generated from customer reviews
        </span>
      </div>
    </div>
  );
};

export default ReviewSummary;

