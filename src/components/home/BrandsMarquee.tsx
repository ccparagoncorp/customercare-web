'use client';

import Image from 'next/image';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import homeContent from '@/content/home.json';

interface BrandsMarqueeProps {
  className?: string;
}

const brands = homeContent.brands.items;

export default function BrandsMarquee({ className = '' }: BrandsMarqueeProps) {
  return (
    <section className={`py-24 bg-gradient-to-br from-[#141825] via-[#0f1419] to-[#0a0e13] relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our
            <span className="ml-2 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              Brands
            </span>
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-32"></div>
            <div className="w-3 h-3 bg-white rotate-45"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-32"></div>
          </div>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {homeContent.brands.description}
          </p>
        </div>
        
        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#141825] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#141825] to-transparent z-10 pointer-events-none"></div>
          
          <Marquee 
            speed={50}
            gradient={false}
            pauseOnHover={true}
          >
            {brands.map((brand: any, index: number) => (
              <div key={index} className="mx-6 group">
                <Link href={brand.link} target="_blank" className="block">
                  <div className="bg-white backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-72 h-56 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="relative">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#03438f]/20 to-transparent rounded-lg blur-xl scale-110 opacity-0 transition-opacity duration-500"></div>
                      
                      <Image
                        src={brand.logo}
                        alt={brand.alt}
                        width={200}
                        height={120}
                        className="max-w-full max-h-full object-contain relative z-10 transition-transform duration-300 "
                      />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/30"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
