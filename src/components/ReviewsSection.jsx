'use client';

import React, { useState } from 'react';
import { Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    review: 'The whole wheat atta makes incredibly soft rotis that stay fresh for hours. The texture and taste are clearly superior to regular store brands.',
    date: 'January 2026',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Bangalore, Karnataka',
    rating: 5,
    review: "I switched to their multigrain atta and my family didn't even notice the change — but we definitely feel lighter and healthier.",
    date: 'December 2025',
  },
  {
    id: 3,
    name: 'Anjali Patel',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    review: 'Their besan is pure and aromatic. The pakoras and chillas taste amazing — no bitterness at all.',
    date: 'January 2026',
  },
  {
    id: 4,
    name: 'Suresh Reddy',
    location: 'Hyderabad, Telangana',
    rating: 5,
    review: 'The ragi and jowar flours are very fresh and finely milled. Perfect for my gluten-free diet.',
    date: 'December 2025',
  },
  {
    id: 5,
    name: 'Meera Iyer',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    review: 'You can actually feel the difference in quality. The flour smells fresh and the dough feels smoother.',
    date: 'January 2026',
  },
  {
    id: 6,
    name: 'Vikram Singh',
    location: 'Delhi NCR',
    rating: 5,
    review: 'As someone focused on fitness, I love their high-protein flour options. Great taste without compromising nutrition.',
    date: 'January 2026',
  },
  {
    id: 7,
    name: 'Kavita Desai',
    location: 'Pune, Maharashtra',
    rating: 5,
    review: 'The multigrain atta has become a daily staple in our home. Rotis stay soft and digestion feels much better.',
    date: 'January 2026',
  },
  {
    id: 8,
    name: 'Arjun Nair',
    location: 'Kochi, Kerala',
    rating: 5,
    review: 'Very consistent quality every time I order. It feels trustworthy and professionally packaged.',
    date: 'December 2025',
  },
];

const duplicatedReviews = [...reviews, ...reviews];

export function ReviewsSection() {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const displayedMobileReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 overflow-hidden"
      style={{ backgroundColor: '#FAFAF8' }}
    >
      <div className="mx-auto px-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-14">
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#2F6B3F' }}>
            Customer Love
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight" style={{ color: '#5B4636' }}>
            Loved by Thousands<br />
            <span style={{ color: '#2F6B3F' }}>Families Across India</span>
          </h2>
          <p className="text-xs sm:text-sm mt-4" style={{ color: '#999' }}>
            Real reviews from real people who trust us for their daily organic needs
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 flex-wrap">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-2xl leading-none" style={{ color: '#2F6B3F' }}>★</span>
              ))}
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#3A3A3A' }}>5.0</span>
            <span className="text-[10px] sm:text-xs" style={{ color: '#999' }}>850+ reviews</span>
            <div
              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#E8F5E9', color: '#2F6B3F' }}
            >
              <span>✔</span>
              <span>Verified Customers</span>
            </div>
          </div>
        </div>

        {/* ── MOBILE: stacked cards ── */}
        <div className="sm:hidden flex flex-col gap-4">
          {displayedMobileReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="px-6 py-2.5 rounded-lg font-medium text-xs border-2 transition-all duration-200 hover:shadow-md"
              style={{ borderColor: '#2F6B3F', color: '#2F6B3F', backgroundColor: 'transparent' }}
            >
              {showAllReviews ? 'Show Less' : 'View All Reviews'}
            </button>
          </div>
        </div>

        {/* ── DESKTOP: marquee carousel ── */}
        <div className="hidden sm:block relative">
          {/*
           * Edge fades — same exact background colour as section (#FAFAF8),
           * holding solid for 60% then fading to transparent.
           * Using rgba() for the transparent stop avoids browser colour interpolation bugs.
           */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: '120px',
              background: 'linear-gradient(to right, #FAFAF8 0%, #FAFAF8 60%, rgba(250,250,248,0) 100%)',
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: '120px',
              background: 'linear-gradient(to left, #FAFAF8 0%, #FAFAF8 60%, rgba(250,250,248,0) 100%)',
            }}
          />

          {/* Scrolling track */}
          <div className="flex gap-5 lg:gap-6 marquee-track">
            {duplicatedReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="shrink-0 w-72 lg:w-96 rounded-xl p-6 lg:p-7 relative transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E1D8' }}
              >
                <div className="absolute top-6 right-6" style={{ opacity: 0.07 }}>
                  <Quote className="w-12 h-12" style={{ color: '#2F6B3F' }} />
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-xl leading-none" style={{ color: '#2F6B3F' }}>★</span>
                  ))}
                </div>

                <p className="text-sm lg:text-base leading-relaxed mb-6" style={{ color: '#3A3A3A' }}>
                  "{review.review}"
                </p>

                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #E6E1D8' }}>
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: '#F0EDE6', color: '#2F6B3F' }}
                  >
                    {review.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm" style={{ color: '#3A3A3A' }}>{review.name}</div>
                    <div className="text-xs" style={{ color: '#999' }}>{review.location}</div>
                  </div>
                  <div className="ml-auto text-xs shrink-0" style={{ color: '#bbb' }}>{review.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-reviews {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          animation: marquee-reviews 32s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

/* Extracted mobile card */
function ReviewCard({ review }) {
  return (
    <div
      className="w-full rounded-xl p-4 relative transition-all duration-300 hover:shadow-md"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E1D8' }}
    >
      <div className="absolute top-3 right-3" style={{ opacity: 0.07 }}>
        <Quote className="w-8 h-8" style={{ color: '#2F6B3F' }} />
      </div>

      <div className="flex gap-0.5 mb-2">
        {[...Array(review.rating)].map((_, i) => (
          <span key={i} className="text-lg leading-none" style={{ color: '#2F6B3F' }}>★</span>
        ))}
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: '#3A3A3A' }}>
        "{review.review}"
      </p>

      <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid #E6E1D8' }}>
        <div
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{ backgroundColor: '#F0EDE6', color: '#2F6B3F' }}
        >
          {review.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm" style={{ color: '#3A3A3A' }}>{review.name}</div>
          <div className="text-xs" style={{ color: '#999' }}>{review.location}</div>
        </div>
      </div>
    </div>
  );
}

export default ReviewsSection;