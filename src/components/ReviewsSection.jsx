'use client';

import React, { useState } from 'react';
import { Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Priya P.',
    location: 'Mumbai',
    rating: 5,
    review: 'Rotis are seriously soft. Been using for 2 weeks now and already ordering more.',
    date: '2 weeks ago',
  },
  {
    id: 2,
    name: 'Rajesh K.',
    location: 'Bangalore',
    rating: 4,
    review: 'Really good quality but took longer to arrive. Still happy with the product though.',
    date: '1 month ago',
  },
  {
    id: 3,
    name: 'Anjali',
    location: 'Ahmedabad',
    rating: 5,
    review: "Finally found a besan that doesn't taste bitter. Making the best pakoras ever 😄",
    date: '2 weeks ago',
  },
  {
    id: 4,
    name: 'Suresh',
    location: 'Hyderabad',
    rating: 4,
    review: 'Good flour and packaging. Would prefer if price was a bit lower, but solid quality.',
    date: '3 weeks ago',
  },
  {
    id: 5,
    name: 'Meera',
    location: 'Chennai',
    rating: 5,
    review: 'My kids actually like the multigrain rotis now. No complaints from them lol',
    date: '1 month ago',
  },
  {
    id: 6,
    name: 'Vikram S.',
    location: 'Delhi',
    rating: 5,
    review: 'Consistent quality every time. Never disappointed.',
    date: '1 month ago',
  },
  {
    id: 7,
    name: 'Kavita',
    location: 'Pune',
    rating: 5,
    review: 'The ragi flour is amazing. So fresh and no weird aftertaste.',
    date: '2 weeks ago',
  },
  {
    id: 8,
    name: 'Arjun',
    location: 'Kochi',
    rating: 4,
    review: 'Good product overall. Packaging could be more eco-friendly though.',
    date: '3 weeks ago',
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
            Trusted by Growing<br />
            <span style={{ color: '#2F6B3F' }}>Families Across India</span>
          </h2>
          <p className="text-xs sm:text-sm mt-4" style={{ color: '#999' }}>
            Real reviews from customers just like you
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 flex-wrap">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className="text-2xl leading-none" 
                  style={{ 
                    color: i < 4 ? '#2F6B3F' : 'transparent',
                    background: i === 4 ? 'linear-gradient(to right, #2F6B3F 50%, #ffffff 50%)' : 'none',
                    WebkitBackgroundClip: i === 4 ? 'text' : 'unset',
                    WebkitTextFillColor: i === 4 ? 'transparent' : 'unset',
                    backgroundClip: i === 4 ? 'text' : 'unset',
                    WebkitTextStroke: i === 4 ? '0.8px #2F6B3F' : '0px'
                  }}
                >★</span>
              ))}
            </div>
            <span className="text-[10px] sm:text-xs" style={{ color: '#999' }}>Rated 4.8 by 34 customers</span>
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
        <div className="hidden sm:block relative overflow-hidden">
          {/* Left Gradient Fade */}
          <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#FAFAF8] via-[#FAFAF8]/70 to-transparent z-10 pointer-events-none" />

          {/* Right Gradient Fade */}
          <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#FAFAF8] via-[#FAFAF8]/70 to-transparent z-10 pointer-events-none" />

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
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl leading-none" style={{ 
                      color: i < review.rating ? '#2F6B3F' : '#ffffff',
                      WebkitTextStroke: i >= review.rating ? '0.8px #2F6B3F' : '0px'
                    }}>★</span>
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
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm" style={{ color: '#3A3A3A' }}>{review.name}</div>
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
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-lg leading-none" style={{ 
            color: i < review.rating ? '#2F6B3F' : '#ffffff',
            WebkitTextStroke: i >= review.rating ? '0.8px #2F6B3F' : '0px'
          }}>★</span>
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
        </div>
      </div>
    </div>
  );
}

export default ReviewsSection;