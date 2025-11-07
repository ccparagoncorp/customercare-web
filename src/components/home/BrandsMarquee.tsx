'use client';

import Image from 'next/image';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import homeContent from '@/content/home.json';
import { ScrollAnimation } from '@/components/animations';

interface Brand {
  logo: string;
  alt: string;
  link: string;
}

interface BrandsMarqueeProps {
  className?: string;
}

const brands = homeContent.brands.items as Brand[];

export default function BrandsMarquee({ className = '' }: BrandsMarqueeProps) {
  return (
    <section className={`py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#141825] via-[#0f1419] to-[#0a0e13] relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            {/* Header */}
            <ScrollAnimation direction="up" delay={0.2}>
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
                  Our
                  <span className="ml-1 sm:ml-2 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                    Brands
                  </span>
                </h2>

                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-16 sm:max-w-24 md:max-w-32"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rotate-45"></div>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-16 sm:max-w-24 md:max-w-32"></div>
                </div>

                <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
                  {homeContent.brands.description}
                </p>
              </div>
            </ScrollAnimation>
        
        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-16 sm:w-24 md:w-32 h-full bg-gradient-to-r from-[#141825] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-16 sm:w-24 md:w-32 h-full bg-gradient-to-l from-[#141825] to-transparent z-10 pointer-events-none"></div>
          
          <Marquee 
            speed={50}
            gradient={false}
            pauseOnHover={true}
          >
            {brands.map((brand, index) => (
              <div key={index} className="mx-3 sm:mx-4 md:mx-6 group">
                <Link href={brand.link} target="_blank" className="block cursor-pointer">
                  <div className="bg-white backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 w-48 sm:w-60 md:w-72 h-36 sm:h-44 md:h-56 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="relative">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#03438f]/20 to-transparent rounded-lg blur-xl scale-110 opacity-0 transition-opacity duration-500"></div>
                      
                      <Image
                        src={brand.logo}
                        alt={brand.alt}
                        width={160}
                        height={96}
                        className="max-w-full max-h-full object-contain relative z-10 transition-transform duration-300 sm:w-[180px] sm:h-[108px] md:w-[200px] md:h-[120px]"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center gap-2 sm:gap-4">
            <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-white/30"></div>
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-white/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
