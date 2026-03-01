'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export function AboutusComponent() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/about');
  };

  const cards = [
    {
      title: 'About Us',
      description: 'Green Valley Naturals is certified organic with APEDA and USOCA accreditation. <br /> <br /> We deliver farm-fresh, pure products with integrity and environmental responsibility.',
      accent: '#2F6B3F'
    },
    {
      title: 'Our Vision',
      description: 'To be the most trusted organic brand globally, making healthy food accessible to every family. <br /> <br /> Leading with transparency, quality, and sustainable practices.',
      accent: '#2F6B3F'
    },
    {
      title: 'Our Mission',
      description: 'Empower farmers and nourish families through authentic, trustworthy organic products. <br /> <br /> Complete transparency from farm to table, always.',
      accent: '#2F6B3F'
    }
  ];

  return (
    <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-10" style={{ backgroundColor: '#F8F6F2' }}>
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 mx-auto max-w-3xl">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6"
            style={{ color: '#2F6B3F' }}
          >
            Who We Are
          </h2>
          <p 
            className="text-xs sm:text-sm md:text-base leading-relaxed"
            style={{ color: '#6B6B6B' }}
          >
            Our commitment to quality, sustainability, and customer excellence
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E1D8'
              }}
              onClick={handleNavigate}
            >
              <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                {/* Title */}
                <h3 
                  className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-2 sm:mb-3 md:mb-4 transition-colors duration-300 text-center"
                  style={{ color: '#2F6B3F' }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p 
                  className="text-xs sm:text-xs md:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4 md:mb-6 text-center"
                  style={{ color: '#6B6B6B' }}
                  dangerouslySetInnerHTML={{ __html: card.description }}
                />

                {/* CTA Button */}
                <div className="text-center">
                  <button 
                    className="inline-flex items-center font-semibold text-xs sm:text-xs md:text-sm lg:text-sm transition-colors duration-300 hover:opacity-80"
                    style={{ color: card.accent }}
                  >
                    <span>Learn More</span>
                    <span className="ml-1">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutusComponent;
