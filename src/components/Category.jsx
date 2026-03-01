'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'Wheat Flour', image: '/images/attajpeg.jpeg' },
  { name: 'Beans', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png' },
  { name: 'Ragi', image: '/images/ragi.jpeg' },
  { name: 'Bajra', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png' },
  { name: 'Makka', image: '/images/makka.jpeg' },
  { name: 'Chana Dal Besan', image: '/images/besan.jpeg' },
  { name: 'Jow', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png' },
  { name: 'Multigrain', image: '/images/multigrain.jpeg' },
];

const duplicatedCategories = [...categories, ...categories];

export function CategoryGrid() {
  const router = useRouter();
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const resumeTimeoutRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cardWidth = isMobile ? 130 : 200;
  const gap = isMobile ? 8 : 12;

  // ── Arrow buttons: switch to JS scrollLeft on the overflow container ──
  // We wrap the track in an overflow-x-auto container so scrollBy works.
  // Animation lives on the inner track div only.
  const scrollContainerRef = useRef(null);

  const handleArrow = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const amount = (cardWidth + gap) * 2;
    container.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryName) => {
    router.push(`/collection?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ backgroundColor: '#F8F6F2' }}>
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-3xl md:text-4xl font-semibold mb-2" style={{ color: '#5B4636' }}>
            Shop by Category
          </h3>
          <p className="text-base" style={{ color: '#6B6B6B' }}>
            Explore our wide range of products
          </p>
        </div>

        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left fade */}
          <div className="absolute left-0 top-0 h-full w-8 sm:w-14 bg-gradient-to-r from-[#F8F6F2] to-transparent z-10 pointer-events-none" />

          {/* Left arrow */}
          <button
            onClick={() => handleArrow('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full
                       opacity-0 group-hover:opacity-90 hover:!opacity-100
                       transition-opacity duration-300 -translate-x-3 sm:-translate-x-4"
            style={{ backgroundColor: '#FFFFFF', color: '#2F6B3F', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/*
           * Scroll container — overflow-x-auto lets scrollBy() work for arrows.
           * The inner track animates via CSS marquee.
           * On hover: animationPlayState pauses the transform mid-frame (no snap).
           */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div
              ref={trackRef}
              className="flex"
              style={{
                gap: `${gap}px`,
                width: 'max-content',
                animationName: 'marquee',
                animationDuration: isMobile ? '20s' : '30s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                // KEY FIX: pause in-place instead of removing animation (which would snap to transform:none)
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {duplicatedCategories.map((category, idx) => (
                <button
                  key={`cat-${idx}`}
                  onClick={() => handleCategoryClick(category.name)}
                  className="rounded-lg overflow-hidden flex flex-col bg-white shrink-0
                             transition-shadow duration-300 hover:shadow-md hover:-translate-y-0.5"
                  style={{ border: '1px solid #E6E1D8', width: `${cardWidth}px` }}
                  aria-label={`Browse ${category.name}`}
                >
                  <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: '1 / 1' }}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80';
                      }}
                    />
                  </div>
                  <div className="p-2 sm:p-3 flex items-center justify-center text-center">
                    <h4 className="text-[10px] sm:text-xs lg:text-sm font-medium leading-tight" style={{ color: '#3A3A3A' }}>
                      {category.name}
                    </h4>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right fade */}
          <div className="absolute right-0 top-0 h-full w-8 sm:w-14 bg-gradient-to-l from-[#F8F6F2] to-transparent z-10 pointer-events-none" />

          {/* Right arrow */}
          <button
            onClick={() => handleArrow('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full
                       opacity-0 group-hover:opacity-90 hover:!opacity-100
                       transition-opacity duration-300 translate-x-3 sm:translate-x-4"
            style={{ backgroundColor: '#FFFFFF', color: '#2F6B3F', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

export default CategoryGrid;