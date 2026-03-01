'use client';

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import RatingSummary from './RatingSummary';
import ReviewSummary from './ReviewSummary';
import { ShopContext } from '@/context/ShopContext';

const ReviewSection = ({ productId }) => {
  const { token, backendUrl } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get current user ID from localStorage (set when user logs in)
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setCurrentUserId(userId);
    console.log('Current user ID from localStorage:', userId);
  }, []);

  // Debug user context
  useEffect(() => {
    console.log('=== ReviewSection User Context ===', {
      currentUserId,
      token: !!token,
      backendUrl
    });
  }, [currentUserId, token]);

  // Fetch reviews from API
  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Fetch reviews
      const reviewResponse = await axios.get(`${backendUrl}/api/review/product/${productId}`);
      
      if (reviewResponse.data.success) {
        setReviews(reviewResponse.data.reviews || []);
        setAverageRating(reviewResponse.data.averageRating || 0);
      } else {
        setReviews([]);
        setAverageRating(0);
      }

      // Fetch product data (for review summary)
      try {
        const productResponse = await axios.get(`${backendUrl}/api/product/single?id=${productId}`);
        if (productResponse.data.success) {
          setProduct(productResponse.data.product);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
      setReviews([]);
      setAverageRating(0);
    } finally {
      setIsLoading(false);
    }
  };


  // Handle review submission via API
  const handleReviewSubmit = async (formData) => {
    try {
      setIsFormLoading(true);
      setError('');

      // Add token to headers if available
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(
        `${backendUrl}/api/review/add`,
        formData,
        { headers }
      );

      if (response.data.success) {
        // Refresh reviews list
        await fetchReviews();
        setShowForm(false);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Failed to post review');
      }
    } catch (err) {
      console.error('Error posting review:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to post review';
      setError(errorMsg);
      throw err;
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle review deletion via API
  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      // Add token to headers if available
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.delete(
        `${backendUrl}/api/review/${reviewId}`,
        { headers }
      );

      if (response.data.success) {
        // Refresh reviews list
        await fetchReviews();
      } else {
        setError(response.data.message || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete review';
      setError(errorMsg);
    }
  };

  // Handle review edit via API
  const handleEditReview = async (formData) => {
    try {
      setError('');
      const reviewId = formData.get('reviewId');

      // Add token to headers if available
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.put(
        `${backendUrl}/api/review/${reviewId}`,
        formData,
        { headers }
      );

      if (response.data.success) {
        // Refresh reviews list
        await fetchReviews();
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Failed to update review');
      }
    } catch (err) {
      console.error('Error updating review:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update review';
      setError(errorMsg);
      throw err;
    }
  };

  // Get sorted reviews based on sort option
  const getSortedReviews = () => {
    const sortedReviews = [...reviews];

    switch (sortOption) {
      case 'oldest':
        return sortedReviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'highest':
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sortedReviews.sort((a, b) => a.rating - b.rating);
      case 'newest':
      default:
        return sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  return (
    <section className="py-6 sm:py-8 px-5 border-t" style={{ borderColor: '#E6E1D8' }}>
      <div className="max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="flex items-center gap-2 sm:gap-3 mt-1">
            <div className="flex items-center gap-0.5">
              <span className="text-sm sm:text-base font-semibold text-gray-900">
                {averageRating > 0 ? averageRating.toFixed(1) : 'No'} ★
              </span>
              <span className="text-xs text-gray-600">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
        </div>

        {/* Write Review Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 sm:px-4 py-1 sm:py-1.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-xs sm:text-sm"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-4 sm:mb-5">
          <ReviewForm
            productId={productId}
            onSubmit={handleReviewSubmit}
            onClose={() => setShowForm(false)}
            isLoading={isFormLoading}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Rating Summary */}
      <RatingSummary reviews={reviews} averageRating={averageRating} />

      {/* Review Summary Card */}
      {/* Show summary if we have reviews or product data with summary */}
      {reviews.length > 0 && (
        <ReviewSummary 
          summary={product?.reviewSummary}
          rating={averageRating}
          reviewCount={reviews.length}
          reviews={reviews}
        />
      )}

      {/* Sorting Dropdown */}
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
        <label className="text-xs sm:text-sm font-medium text-gray-700">Sort by:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <ReviewList
        reviews={getSortedReviews()}
        isLoading={isLoading}
        onDeleteReview={handleDeleteReview}
        onEditReview={handleEditReview}
        currentUserId={currentUserId}
        backendUrl={backendUrl}
        token={token}
      />
      </div>
    </section>
  );
};

export default ReviewSection;
