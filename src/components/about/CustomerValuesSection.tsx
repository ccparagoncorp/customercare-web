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
                    className="relative bg-gradient-to-br from-white to-indigo-50/40 border border-blue-200/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group cursor-pointer h-72 flex flex-col overflow-hidden"
                    onMouseEnter={() => setHoveredLetter(value.letter)}
                    onMouseLeave={() => setHoveredLetter(null)}
                  >
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 rounded-full blur-2xl"></div>
                    </div>
                    
                    {/* Geometric Decorative Shapes */}
                    <div className="absolute top-4 right-4 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                      <div className="absolute top-0 right-0 w-8 h-8 border-2 border-blue-400 rounded-tl-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 bg-blue-300 rounded-full"></div>
                    </div>
                    
                    {/* Corner Accent */}
                    <div className="absolute top-0 left-0 w-20 h-20">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent rounded-tl-2xl"></div>
                      <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    
                    {/* Animated Border Glow */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10 ${
                      hoveredLetter === value.letter ? 'animate-pulse' : ''
                    }`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Letter & Word Header */}
                      <div className="flex items-center gap-4 mb-4 flex-shrink-0">
                        <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center border-2 border-blue-300 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-xl font-bold text-white">{value.letter}</span>
                          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                            {value.word}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="pl-4 flex-grow flex flex-col relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-indigo-500 to-blue-400 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <p className="text-black leading-relaxed text-md font-medium relative z-10 group-hover:text-gray-900 transition-colors duration-300">
                          {value.description}
                        </p>
                      </div>
                      
                      {/* Hover indicator */}
                      <div className={`mt-4 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-300 flex-shrink-0 shadow-lg shadow-blue-500/50 ${
                        hoveredLetter === value.letter ? 'w-full opacity-100' : 'w-0 opacity-0'
                      }`}></div>
                    </div>
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