'use client';

import { useState, useEffect } from 'react';
import faqContent from '@/content/faq.json';
import FAQItem from './FAQItem';
import FAQFilterTabs from './FAQFilterTabs';

interface FAQListProps {
  className?: string;
}

export default function FAQList({ className = '' }: FAQListProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredFAQs, setFilteredFAQs] = useState(faqContent.faqs);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredFAQs(faqContent.faqs);
    } else {
      const filtered = faqContent.faqs.filter(faq => faq.category === activeCategory);
      setFilteredFAQs(filtered);
    }
  }, [activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <>
      <FAQFilterTabs onCategoryChange={handleCategoryChange} />
      
      <section className={`py-16 bg-gray-900 ${className}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <FAQItem
                key={faq.id}
                id={faq.id}
                category={faq.category}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
          
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.82-6.22-2.2m0 0L6 10.5m-1.78 2.3l1.78-2.3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No FAQs found
              </h3>
              <p className="text-gray-400">
                No frequently asked questions found for this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
