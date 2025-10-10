'use client';

import { useState } from 'react';

interface FAQItemProps {
  id: number;
  category: string;
  question: string;
  answer: string;
  className?: string;
}

export default function FAQItem({ id, category, question, answer, className = '' }: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-gray-700 rounded-xl overflow-hidden border border-gray-600 transition-all duration-300 hover:border-gray-500 ${className}`}>
      {/* Question */}
      <button
        onClick={toggleExpanded}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
      >
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white pr-3 sm:pr-4">
          {question}
        </h3>
        <div className="flex-shrink-0">
          <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>
      
      {/* Answer */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <div className="border-t border-gray-600 pt-3 sm:pt-4">
            <p className="text-white leading-relaxed text-sm sm:text-base">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
