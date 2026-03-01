'use client';

import React, { useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import PhotoGalleryLightbox from './PhotoGalleryLightbox';
import { ThumbsUp } from 'lucide-react';

const ReviewCard = ({ review, onDelete = null, onEdit = null, currentUserId = null, backendUrl = '', token = '' }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [isUserHelpful, setIsUserHelpful] = useState(review.helpfulUsers?.includes(currentUserId) || false);
  const [isLoadingHelpful, setIsLoadingHelpful] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  const isReviewByCurrentUser = currentUserId && review.userId === currentUserId;

  // Check if review is older than 24 hours
  const isReviewOlderThan24Hours = () => {
    const reviewDate = new Date(review.createdAt);
    const now = new Date();
    const diffInHours = (now - reviewDate) / (1000 * 60 * 60);
    return diffInHours > 24;
  };

  const canEditReview = isReviewByCurrentUser && !isReviewOlderThan24Hours();
  
  // Debug logging
  if (typeof window !== 'undefined') {
    if (!window.reviewCardLogged) {
      window.reviewCardLogged = new Set();
    }
    if (!window.reviewCardLogged.has(review._id)) {
      console.log('=== ReviewCard Debug ===', {
        id: review._id,
        title: review.title,
        userName: review.userName,
        rating: review.rating,
        reviewText: review.reviewText?.substring(0, 30),
        photosRaw: review.photos,
        photoCount: review.photos?.length || 0,
        photosArray: Array.isArray(review.photos),
        firstPhoto: review.photos?.[0],
        currentUserId,
        reviewUserId: review.userId,
        isReviewByCurrentUser,
        canEditReview,
        hasOnEdit: !!onEdit,
        hasOnDelete: !!onDelete
      });
      window.reviewCardLogged.add(review._id);
    }
  }
  
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const photos = review.photos && Array.isArray(review.photos) && review.photos.length > 0 ? review.photos : [];

  const handleImageError = (index) => {
    console.error(`Image failed to load at index ${index}:`, photos[index]);
    setFailedImages(prev => new Set([...prev, index]));
  };

  // Handle marking review as helpful
  const handleMarkHelpful = async () => {
    if (isUserHelpful || isLoadingHelpful || !currentUserId) return;

    try {
      setIsLoadingHelpful(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(
        `${backendUrl}/api/review/${review._id}/helpful`,
        { userId: currentUserId },
        { headers }
      );

      if (response.data.success) {
        setHelpfulCount(response.data.helpfulCount);
        setIsUserHelpful(true);
      }
    } catch (err) {
      console.error('Error marking review as helpful:', err);
    } finally {
      setIsLoadingHelpful(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300">
        {/* Header with action buttons */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {/* User Avatar */}
            <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {review.userName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              {/* Rating */}
              <div className="mb-2">
                <StarRating rating={review.rating} isInteractive={false} size="md" />
              </div>

              {/* Title and Author */}
              <div>
                {review.title && (
                  <h4 className="font-semibold text-gray-900 text-sm">{review.title}</h4>
                )}
                <p className="text-xs text-gray-600 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-800">{review.userName}</span>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <span className="text-gray-500">{formattedDate}</span>
                </p>
              </div>
            </div>
          </div>

          {isReviewByCurrentUser && (onDelete || onEdit) && (
            <div className="flex gap-2 shrink-0">
              {canEditReview && onEdit && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(review._id)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Review Text */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {review.reviewText}
        </p>

        {/* Edit Form */}
        {isEditing && onEdit && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <ReviewForm
              productId={review.productId}
              reviewId={review._id}
              initialData={{
                rating: review.rating,
                title: review.title,
                reviewText: review.reviewText
              }}
              isEditing={true}
              onSubmit={async (formData) => {
                const result = await onEdit(formData);
                if (result && result.success) {
                  setIsEditing(false);
                }
                return result;
              }}
              onClose={() => setIsEditing(false)}
            />
          </div>
        )}

        {/* Photos Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
            {photos.map((photo, index) => {
              const photoUrl = photo?.url || photo;
              const isFailedImage = failedImages.has(index);
              
              if (index === 0) {
                console.log(`Photo ${index} rendering:`, { photo, photoUrl, isFailedImage });
              }
              
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedPhotoIndex(index);
                    setCurrentPhotoIndex(index);
                  }}
                  className="cursor-pointer group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-100 h-32"
                >
                  {isFailedImage ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Image failed to load</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={photoUrl}
                        alt={`Review photo ${index + 1}`}
                        onError={() => handleImageError(index)}
                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity rounded-lg" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Verified Badge */}
        {review.verified && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">
            <span className="text-lg leading-none">✓</span>
            Verified Purchase
          </div>
        )}

        {/* Helpful Button */}
        <div className="pt-3 mt-4 border-t border-gray-100">
          <button
            onClick={handleMarkHelpful}
            disabled={isUserHelpful || isLoadingHelpful || !currentUserId}
            className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
              isUserHelpful
                ? 'text-green-600 cursor-default'
                : currentUserId
                ? 'text-gray-600 hover:text-green-600 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isUserHelpful ? 'fill-current' : ''}`} />
            {isUserHelpful ? 'Helpful' : 'Helpful'} ({helpfulCount})
          </button>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhotoIndex !== null && (
        <PhotoGalleryLightbox
          photos={photos}
          initialIndex={currentPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </>
  );
};

export default ReviewCard;
