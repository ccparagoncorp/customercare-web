'use client';

import { useState } from 'react';
import faqContent from '@/content/faq.json';
import { ScrollAnimation, StaggerAnimation } from '@/components/animations';

interface FAQFilterTabsProps {
  onCategoryChange: (category: string) => void;
  className?: string;
}

export default function FAQFilterTabs({ onCategoryChange, className = '' }: FAQFilterTabsProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <section className={`py-6 sm:py-8 bg-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <StaggerAnimation staggerDelay={0.1} direction="up">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {faqContent.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                  activeCategory === category.id
                    ? 'bg-[#03438f] text-white shadow-lg transform scale-105'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </StaggerAnimation>
      </div>
    </section>
  );
}
