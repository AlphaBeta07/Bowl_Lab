'use client';

import React from 'react';
import Hero from '@/components/homepage/Hero';
import HowItWorks from '@/components/homepage/HowItWorks';
import PopularBowls from '@/components/homepage/PopularBowls';
import FreshIngredients from '@/components/homepage/FreshIngredients';
import StorySection from '@/components/homepage/StorySection';
import Testimonials from '@/components/homepage/Testimonials';
import ContactSection from '@/components/homepage/ContactSection';

export default function HomePage() {
  return (
    <div className="w-full">
      <Hero />
      <PopularBowls />
      <HowItWorks />
      <FreshIngredients />
      <StorySection />
      <Testimonials />
      <ContactSection />
    </div>
  );
}
