'use client';

import React, { useState } from 'react';
import StarRating from './StarRating';
import PhotoUpload from './PhotoUpload';
import { Send } from 'lucide-react';

const ReviewForm = ({ productId, onSubmit = null, onClose = null, isLoading = false, initialData = null, isEditing = false, reviewId = null }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [reviewText, setReviewText] = useState(initialData?.reviewText || '');
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    console.log('Form submission started');
    console.log('Rating:', rating, 'Text length:', reviewText.length);

    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      console.error('Validation failed: No rating');
      return;
    }

    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters');
      console.error('Validation failed: Text too short');
      return;
    }

    if (reviewText.trim().length > 1000) {
      setError('Review must be less than 1000 characters');
      console.error('Validation failed: Text too long');
      return;
    }

    if (title && title.length > 100) {
      setError('Title must be less than 100 characters');
      console.error('Validation failed: Title too long');
      return;
    }

    console.log('Validations passed, preparing FormData');

    // Prepare form data
    const formData = new FormData();
    if (isEditing && reviewId) {
      formData.append('reviewId', reviewId);
    }
    formData.append('productId', productId);
    formData.append('rating', rating);
    formData.append('title', title || 'Review');
    formData.append('reviewText', reviewText);

    console.log('FormData prepared:', {
      productId,
      rating,
      title: title || 'Review',
      reviewTextLength: reviewText.length
    });

    // Add photos
    if (photos && photos.length > 0) {
      photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });
    }

    if (onSubmit) {
      try {
        console.log('Calling onSubmit...');
        await onSubmit(formData);
        console.log('onSubmit completed successfully');
        setSuccessMessage(isEditing ? 'Your review has been updated!' : 'Your review has been posted!');
        setTimeout(() => {
          // Reset form
          setTitle('');
          setReviewText('');
          setRating(0);
          setPhotos([]);
          if (onClose) onClose();
        }, 1500);
      } catch (err) {
        console.error('onSubmit error:', err);
        setError(err.message || 'Failed to post review');
      }
    } else {
      console.error('onSubmit prop not provided!');
      setError('Form handler not configured');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
      <h3 className="text-lg font-semibold text-gray-900">
        {isEditing ? 'Edit Review' : 'Write a Review'}
      </h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          isInteractive={true}
          size="lg"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title (Optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 100))}
          placeholder="What's the main point of your review?"
          maxLength={100}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value.slice(0, 1000))}
          placeholder="Share your experience with this product..."
          rows="5"
          maxLength={1000}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{reviewText.length}/1000</p>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos (Optional)
        </label>
        <PhotoUpload onPhotosChange={setPhotos} maxPhotos={2} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (isEditing ? 'Updating...' : 'Posting...') : (
            <>
              <Send className="w-4 h-4" />
              {isEditing ? 'Update Review' : 'Post Review'}
            </>
          )}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
