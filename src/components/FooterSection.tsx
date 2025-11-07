'use client';

import Link from 'next/link';
import Image from 'next/image';
import layoutContent from '@/content/layout.json';
import { StaggerAnimation } from '@/components/animations';

interface FooterSectionProps {
  className?: string;
}

export default function FooterSection({ className = '' }: FooterSectionProps) {
  return (
    <footer className={`bg-gradient-to-br from-[#141825] via-[#0f1419] to-[#0a0e13] relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          <StaggerAnimation staggerDelay={0.2} direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              
              {/* Company Info Column */}
              <div className="lg:col-span-1">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Image src={layoutContent.footer.company.logo} alt="Logo" width={120} height={64} className="sm:w-[150px] sm:h-auto"/>
                </div>

                {/* Tagline */}
                <p className="text-white text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  {layoutContent.footer.company.tagline}
                </p>

                {/* Description */}
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                  {layoutContent.footer.company.description}
                </p>

                {/* Social Media Links (Instagram, TikTok only) */}
                <div className="flex items-center gap-4">
                  {/* Instagram */}
                  <Link href={layoutContent.footer.social[0].url} aria-label="Instagram" className="group w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#03438f] transition-colors duration-300 cursor-pointer">
                    <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 3a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM17.5 6.25a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
                    </svg>
                  </Link>
                  {/* TikTok */}
                  <Link href={layoutContent.footer.social[1].url} aria-label="TikTok" className="group w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#03438f] transition-colors duration-300 cursor-pointer">
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.003 2c.157 0 .314 0 .47.01a5.99 5.99 0 004.51 4.47v2.18a8.18 8.18 0 01-2.56-.87v6.14a5.62 5.62 0 11-5.62-5.63c.19 0 .37.01.55.03v2.9a2.73 2.73 0 102.73 2.73V2zm0 0"/>
                  </svg>

                  </Link>
                </div>
              </div>

              {/* Quick Links Column */}
              <div>
                <h4 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">Quick Links</h4>
                <ul className="space-y-3 sm:space-y-4">
                  {layoutContent.footer.links.quick.map((name: string, index: number) => {
                    const getHref = (name: string) => {
                      switch (name.toLowerCase()) {
                        case 'home':
                          return '/';
                        case 'about':
                          return '/about';
                        case 'services':
                          return '/services';
                        case 'contact':
                          return '/contact';
                        case 'faq':
                          return '/faq';
                        default:
                          return '#';
                      }
                    };
                    
                    return (
                      <li key={index}>
                        <Link 
                          href={getHref(name)} 
                          className="group text-gray-300 hover:text-white transition-colors duration-300 flex items-center cursor-pointer"
                        >
                          <span className="w-0 h-0 border-l-[3px] sm:border-l-[4px] border-l-transparent border-r-[3px] sm:border-r-[4px] border-r-transparent border-b-[4px] sm:border-b-[6px] border-b-[#03438f] mr-2 sm:mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          <span className="text-sm sm:text-base">{name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Contact Info Column */}
              <div>
                <h4 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">Contact Info</h4>
                <div className="space-y-3 sm:space-y-4">

                  {/* Phone */}
                  <div className="flex items-center gap-2 sm:gap-3 group">
                    <div className="p-2 sm:p-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#03438f] transition-colors duration-300">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                        viewBox="0 0 32 32"
                        fill="currentColor"
                      >
                        <path d="M16.001 3.2c-7.064 0-12.8 5.736-12.8 12.8 0 2.256.592 4.448 1.728 6.4L3.2 28.8l6.592-1.68A12.71 12.71 0 0 0 16 28.8c7.064 0 12.8-5.736 12.8-12.8s-5.736-12.8-12.8-12.8zm0 23.2c-1.92 0-3.776-.512-5.408-1.504l-.384-.224-3.904.992 1.024-3.808-.256-.416A9.53 9.53 0 0 1 6.4 16c0-5.28 4.32-9.6 9.6-9.6s9.6 4.32 9.6 9.6-4.32 9.6-9.6 9.6zm5.44-7.36c-.304-.16-1.792-.896-2.064-.992-.272-.128-.48-.192-.688.128-.208.32-.8.992-.992 1.184-.176.192-.368.224-.688.08-.304-.16-1.28-.48-2.432-1.536-.896-.8-1.504-1.76-1.68-2.08-.176-.304-.016-.48.128-.64.144-.144.304-.368.448-.56.16-.192.208-.32.304-.528.096-.208.048-.384-.016-.528-.064-.144-.688-1.664-.944-2.272-.248-.592-.496-.512-.688-.512-.176-.016-.384-.016-.592-.016s-.544.08-.832.384c-.288.304-1.088 1.056-1.088 2.592 0 1.536 1.12 3.024 1.28 3.232.16.208 2.208 3.36 5.36 4.704.752.32 1.344.512 1.808.656.76.24 1.456.208 2.016.128.624-.096 1.792-.736 2.048-1.44.256-.704.256-1.312.176-1.44-.08-.128-.272-.208-.576-.368z"/>
                      </svg>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">{layoutContent.footer.contact.wa}</span>
                  </div>

                  {/* Call Center */}
                  <div className="flex items-center gap-2 sm:gap-3 group">
                    <div className="p-2 sm:p-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#03438f] transition-colors duration-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24"> <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/> </svg>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">{layoutContent.footer.contact.callCenter}</span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 sm:gap-3 group">
                    <div className="p-2 sm:p-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#03438f] transition-colors duration-300">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">{layoutContent.footer.contact.email}</span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 sm:gap-3 group">
                    <div className="p-2 sm:p-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#03438f] transition-colors duration-300 mt-1">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm leading-relaxed">
                        {layoutContent.footer.contact.addressLines[0]}<br />
                        {layoutContent.footer.contact.addressLines[1]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </StaggerAnimation>
        </div>

        {/* Divider Line */}
        <div className="border-t border-white/10"></div>

        {/* Copyright Section */}
        <div className="py-6 sm:py-8">
          <div className="text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              {layoutContent.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}