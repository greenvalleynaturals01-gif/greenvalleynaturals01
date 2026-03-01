'use client';

import React, { useRef, useEffect, useState } from 'react';
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

// Duplicate categories 3x for seamless infinite scroll
const duplicatedCategories = [...categories, ...categories, ...categories];

export function CategoryGrid() {
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const isResettingRef = useRef(false);

  // Get scroll distance (2 cards)
  const getScrollDistance = () => {
    if (!scrollContainerRef.current) return 0;
    const firstCard = scrollContainerRef.current.querySelector('[data-category-card]');
    if (!firstCard) return 0;
    const cardWidth = firstCard.offsetWidth;
    const gap = parseInt(window.getComputedStyle(scrollContainerRef.current).gap) || 12;
    return (cardWidth + gap) * 2;
  };

  // Scroll handler
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollDistance = getScrollDistance();
    container.scrollBy({
      left: direction === 'left' ? -scrollDistance : scrollDistance,
      behavior: 'smooth',
    });
  };

  // Initialize scroll position to middle
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollDistance = container.scrollWidth / 3;
    container.scrollLeft = scrollDistance;
  }, []);

  // Handle infinite scroll reset
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let resetTimeout = null;

    const handleScroll = () => {
      if (isResettingRef.current) return;

      const oneSetWidth = container.scrollWidth / 3;
      const threshold = 50; // Safety margin

      // If scrolled past the start, jump to middle
      if (container.scrollLeft < threshold) {
        isResettingRef.current = true;
        container.scrollLeft = oneSetWidth;
        resetTimeout = setTimeout(() => {
          isResettingRef.current = false;
        }, 100);
      }

      // If scrolled past the end, jump back to middle
      if (container.scrollLeft > oneSetWidth * 2 - threshold) {
        isResettingRef.current = true;
        container.scrollLeft = oneSetWidth;
        resetTimeout = setTimeout(() => {
          isResettingRef.current = false;
        }, 100);
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, []);

  // Setup auto slide interval
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isHovered) {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
      return;
    }

    // Calculate scroll distance once at start
    const initialScrollDistance = getScrollDistance();

    autoSlideIntervalRef.current = setInterval(() => {
      if (container && !isHovered && !isResettingRef.current) {
        const scrollDistance = getScrollDistance() || initialScrollDistance;
        container.scrollBy({
          left: scrollDistance,
          behavior: 'smooth',
        });
      }
    }, 3000);

    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [isHovered]);

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
          <p className="text-base" style={{ color: '#6B6B6B' }}>Explore our wide range of products</p>
        </div>

        {/* Slider Wrapper */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all duration-300 opacity-70 hover:opacity-100 -translate-x-4 sm:-translate-x-3"
            style={{ backgroundColor: '#FFFFFF', color: '#2F6B3F', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Left Gradient Fade */}
          <div className="absolute left-0 top-0 h-full w-8 sm:w-12 bg-gradient-to-r from-[#F8F6F2] via-[#F8F6F2]/60 to-transparent z-10 rounded-l-lg pointer-events-none" />

          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto scroll-smooth px-2"
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* All categories - 3x duplicated for infinite loop */}
            {duplicatedCategories.map((category, idx) => (
              <button
                key={`cat-${idx}`}
                data-category-card
                onClick={() => handleCategoryClick(category.name)}
                className="group/card rounded-lg overflow-hidden transition-all duration-300 flex flex-col bg-white hover:bg-gray-50 cursor-pointer flex-shrink-0"
                style={{ 
                  border: '1px solid #E6E1D8',
                  width: typeof window !== 'undefined' && window.innerWidth < 768 ? 'clamp(110px, 22vw, 140px)' : 'clamp(140px, 18vw, 220px)',
                }}
              >
                <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80'}
                  />
                </div>
                <div className="p-1.5 sm:p-3 lg:p-4 flex-1 flex items-center justify-center text-center">
                  <h4 className="text-[9px] sm:text-xs lg:text-sm font-medium leading-tight" style={{ color: '#3A3A3A' }}>
                    {category.name}
                  </h4>
                </div>
              </button>
            ))}
          </div>

          {/* Right Gradient Fade */}
          <div className="absolute right-0 top-0 h-full w-8 sm:w-12 bg-gradient-to-l from-[#F8F6F2] via-[#F8F6F2]/60 to-transparent z-10 rounded-r-lg pointer-events-none" />

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all duration-300 opacity-70 hover:opacity-100 translate-x-4 sm:translate-x-3"
            style={{ backgroundColor: '#FFFFFF', color: '#2F6B3F', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hide scrollbar for all browsers */}
      <style>{`
        div[class*="overflow-x-auto"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export default CategoryGrid;
