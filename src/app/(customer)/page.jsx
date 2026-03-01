'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Category from '@/components/Category';
import HomeProducts from '@/components/HomeProducts';
import BenefitsSection from '@/components/BenefitsSection';
import ReviewsSection from '@/components/ReviewsSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import BestsellingProducts from '@/components/BestsellingProducts';
import AboutusComponent from '@/components/AboutusComponent';
import CartPreview from '@/components/CartPreview';

export default function Home() {
  return (
    <div>
      <Hero />
      <Category />
      <HomeProducts />
      <BenefitsSection />
      <ReviewsSection />
      <FeaturedProducts />
      <BestsellingProducts />
      <AboutusComponent />
      <CartPreview />
    </div>
  );
}
