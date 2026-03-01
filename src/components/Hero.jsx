'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

function Hero() {
  return (
    <section className="w-full py-4 sm:py-6 md:py-8 lg:py-12" style={{ backgroundColor: '#F8F6F2' }}>
      <div className="mx-auto py-4 max-w-[1500px] px-6 sm:px-8 md:px-10">
        {/* Premium Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-14 items-center p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Text Content - First on mobile, left on desktop */}
            <div className="order-first lg:order-none space-y-8">
              {/* Single H1 for SEO */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 leading-tight">
                Premium Quality <span style={{ color: '#2F6B3F' }}>Flour & Grains</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Sourced directly from farmers. Packed with nutrition. Delivered fresh to your doorstep.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 md:py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  style={{ backgroundColor: '#2F6B3F' }}
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 md:py-4 rounded-lg font-semibold text-gray-900 border-2 border-gray-300 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Explore Range
                </button>
              </div>
            </div>

            {/* Image Section - Below on mobile, right on desktop */}
            <div className="order-last lg:order-0">
              <div className="relative w-full rounded-3xl overflow-hidden ring-1 ring-black/5">
                <img
                  src="/images/hero-products.jpeg"
                  alt="Premium flour and grain products"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
