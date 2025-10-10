'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import layoutContent from '@/content/layout.json';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      {/* White Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-3 sm:mt-6">
        <div className={`bg-white backdrop-blur-sm shadow-xl ${isMobileMenuOpen ? 'sm:rounded-full rounded-4xl' : 'rounded-full'}`}>
          <div className="flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/">
            <Image src={layoutContent.header.logo} alt="Logo" width={120} height={64} className="cursor-pointer sm:w-[150px] sm:h-auto"/>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {layoutContent.header.nav.map((label) => {
              const getHref = (label: string) => {
                switch (label.toLowerCase()) {
                  case 'home':
                    return '/';
                  case 'about':
                    return '/about';
                  case 'contact':
                    return '/contact';
                  case 'faq':
                    return '/faq';
                  default:
                    return '#';
                }
              };
              
              const isActive = pathname === getHref(label);
              
              return (
                <Link 
                  key={label} 
                  href={getHref(label)} 
                  className={`relative text-gray-700 hover:text-[#03438f] transition-colors font-medium cursor-pointer ${
                    isActive ? 'text-[#03438f]' : ''
                  }`}
                >
                  {label}
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#03438f] rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Desktop Login Button */}
          <button className="hidden md:block bg-[#03438f] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#012f65] cursor-pointer text-sm">
            {layoutContent.header.loginText}
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white rounded-b-full">
              <div className="px-4 py-4 space-y-3">
                {layoutContent.header.nav.map((label) => {
                  const getHref = (label: string) => {
                    switch (label.toLowerCase()) {
                      case 'home':
                        return '/';
                      case 'about':
                        return '/about';
                      case 'contact':
                        return '/contact';
                      case 'faq':
                        return '/faq';
                      default:
                        return '#';
                    }
                  };
                  
                  const isActive = pathname === getHref(label);
                  
                  return (
                    <Link 
                      key={label} 
                      href={getHref(label)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer ${
                        isActive 
                          ? 'text-[#03438f] bg-blue-50' 
                          : 'text-gray-700 hover:text-[#03438f] hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
                
                {/* Mobile Login Button */}
                <button className="w-full mt-4 bg-[#03438f] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#012f65] cursor-pointer text-sm">
                  {layoutContent.header.loginText}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
