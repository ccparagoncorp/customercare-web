'use client';

import { useState } from 'react';
import aboutContent from '@/content/about.json';
import { ScrollAnimation, StaggerAnimation, ScaleAnimation } from '@/components/animations';

interface CustomerValuesSectionProps {
  className?: string;
}

export default function CustomerValuesSection({ className = '' }: CustomerValuesSectionProps) {
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  
  return (
    <section className={`py-24 bg-[#03438f] relative ${className}`}>
      {/* Subtle Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <ScrollAnimation direction="up" delay={0.2}>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              {aboutContent.customerValues.title}
            </h2>
            
            {/* CUSTOMER Acronym */}
            <div className="mb-12">
              <p className="text-xl text-blue-200 font-medium mt-6">
                {aboutContent.customerValues.acronymSubtitle}
              </p>
            </div>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-32"></div>
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-32"></div>
            </div>
            
            <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              {aboutContent.customerValues.subtitle}
            </p>
          </div>
        </ScrollAnimation>

        {/* CUSTOMER Values - Always Visible */}
        <div className="mb-20">
          <StaggerAnimation staggerDelay={0.15} direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutContent.customerValues.values.map((value, index) => (
                <ScaleAnimation key={index} scale={0.9}>
                  <div 
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onMouseEnter={() => setHoveredLetter(value.letter)}
                    onMouseLeave={() => setHoveredLetter(null)}
                  >
                {/* Letter & Word Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
                    <span className="text-xl font-bold text-blue-600">{value.letter}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {value.word}
                    </h3>
                    <div className="text-sm text-gray-500 font-medium">
                      {value.letter} = {value.word}
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="border-l-2 border-blue-300 pl-4">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
                
                    {/* Hover indicator */}
                    <div className={`mt-4 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full transition-all duration-300 ${
                      hoveredLetter === value.letter ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}></div>
                  </div>
                </ScaleAnimation>
              ))}
            </div>
          </StaggerAnimation>
          
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-slate-400/30"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-slate-400/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}