"use client";

import React from 'react';
import faqContent from '@/content/faq.json';

const StillNeedHelpSection: React.FC = () => {
  const { title, description, contactOptions } = faqContent.stillNeedHelp;
  
  const handleCallClick = () => {
    const callOption = contactOptions.find(option => option.type === 'call');
    if (callOption) {
      window.open(`tel:${callOption.phoneNumber}`, '_self');
    }
  };

  const handleEmailClick = () => {
    const emailOption = contactOptions.find(option => option.type === 'email');
    if (emailOption) {
      window.open(`mailto:${emailOption.emailAddress}`, '_self');
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-black py-20 px-4 sm:px-6 lg:px-8">
      {/* Border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-700"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700"></div>
      
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up">
          {title}
        </h2>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto animate-fade-in-up-delay">
          {description}
        </p>
        
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Call Us Card */}
          <div className="group relative bg-gradient-to-br from-[#03438f] to-[#013069] transition-all duration-500 ease-out rounded-xl p-6 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-2 cursor-pointer border border-blue-500/20 overflow-hidden animate-fade-in-left">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            <button
              onClick={handleCallClick}
              className="w-full flex items-center space-x-6 relative z-10"
            >
              {/* Phone Icon with Background */}
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 flex-shrink-0 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                <svg 
                  className="w-7 h-7 text-white transition-all duration-300 group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
              </div>
              
              {/* Content */}
              <div className="text-left flex-1">
                <h3 className="text-white font-bold text-lg mb-1 transition-all duration-300 group-hover:text-blue-100">{contactOptions[0].title}</h3>
                <p className="text-white/90 text-sm mb-3 transition-all duration-300 group-hover:text-white">{contactOptions[0].description}</p>
                <div className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm inline-block transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105">
                  <span className="text-white font-mono text-sm">{contactOptions[0].contact}</span>
                </div>
              </div>
          
            </button>
          </div>
          
          {/* Email Us Card */}
          <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-500 ease-out rounded-xl p-6 shadow-2xl hover:shadow-gray-500/25 transform hover:scale-105 hover:-translate-y-2 cursor-pointer border border-gray-600/20 overflow-hidden animate-fade-in-right">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-blue-300/30 rounded-full animate-ping"></div>
              <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-blue-400/15 rounded-full animate-bounce"></div>
            </div>
            
            <button
              onClick={handleEmailClick}
              className="w-full flex items-center space-x-6 relative z-10"
            >
              {/* Email Icon with Background */}
              <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400/30 flex-shrink-0 transition-all duration-300 group-hover:bg-blue-500/30 group-hover:scale-110">
                <svg 
                  className="w-7 h-7 text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              
              {/* Content */}
              <div className="text-left flex-1">
                <h3 className="text-white font-bold text-lg mb-1 transition-all duration-300 group-hover:text-gray-100">{contactOptions[1].title}</h3>
                <p className="text-white/90 text-sm mb-3 transition-all duration-300 group-hover:text-white">{contactOptions[1].description}</p>
                <div className="px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-400/20 backdrop-blur-sm inline-block transition-all duration-300 group-hover:bg-blue-500/20 group-hover:scale-105">
                  <span className="text-blue-300 font-mono text-sm group-hover:text-blue-200 transition-colors duration-300">{contactOptions[1].contact}</span>
                </div>
              </div>
              
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StillNeedHelpSection;
