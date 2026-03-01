'use client';

import React from 'react';
import { Leaf, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#F8F6F2' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#5B4636' }}>
            About Green Valley Naturals
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: '#555' }}>
            Your trusted source for 100% certified organic products from farm to table
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#5B4636' }}>
              Our Story
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: '#3A3A3A' }}>
              Green Valley Naturals has attained fully organic status in accordance with APEDA (Agriculture Produce Export Development Authority) standards. We are committed to providing 100% authentic, farm-fresh organic products sourced directly from certified organic farms across India.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: '#3A3A3A' }}>
              Every product undergoes rigorous quality checks to ensure purity, freshness, and nutritional value. We believe in transparency, sustainability, and making organic living accessible to every Indian household.
            </p>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#F0EDE6' }}>
                  <Award className="w-6 h-6" style={{ color: '#2F6B3F' }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: '#5B4636' }}>
                  Our Vision
                </h3>
              </div>
              <p className="text-base leading-relaxed" style={{ color: '#6B6B6B' }}>
                To be a leading provider of high-quality organic goods in the global market. We want to create a global network of delighted customers and supply the world with natural, nutritious, and 100% organic produce.
              </p>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#F0EDE6' }}>
                  <Leaf className="w-6 h-6" style={{ color: '#2F6B3F' }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: '#5B4636' }}>
                  Our Mission
                </h3>
              </div>
              <p className="text-base leading-relaxed" style={{ color: '#6B6B6B' }}>
                By providing high-quality, farm-fresh organic goods, we want to add value to customers' expectations and support sustainable farming practices that nourish people and the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#F8F6F2' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#5B4636' }}>
            Why Choose Green Valley Naturals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E6E1D8' }}>
                <Leaf className="w-8 h-8" style={{ color: '#2F6B3F' }} />
              </div>
              <h4 className="text-xl font-semibold mb-3" style={{ color: '#5B4636' }}>
                100% Certified Organic
              </h4>
              <p style={{ color: '#6B6B6B' }}>
                APEDA certified organic products with no harmful chemicals or pesticides
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E6E1D8' }}>
                <Award className="w-8 h-8" style={{ color: '#2F6B3F' }} />
              </div>
              <h4 className="text-xl font-semibold mb-3" style={{ color: '#5B4636' }}>
                Quality Assured
              </h4>
              <p style={{ color: '#6B6B6B' }}>
                Rigorous quality checks ensure freshness and nutritional value
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E6E1D8' }}>
                <Users className="w-8 h-8" style={{ color: '#2F6B3F' }} />
              </div>
              <h4 className="text-xl font-semibold mb-3" style={{ color: '#5B4636' }}>
                Direct from Farmers
              </h4>
              <p style={{ color: '#6B6B6B' }}>
                Sourced from certified organic farms supporting rural sustainability
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
