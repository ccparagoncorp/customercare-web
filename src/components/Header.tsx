'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import layoutContent from '@/content/layout.json';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const pathname = usePathname();
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      {/* White Navbar Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-6">
        <div className="bg-white backdrop-blur-sm shadow-xl rounded-full">
          <div className="flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <Link href="/">
            <Image src={layoutContent.header.logo} alt="Logo" width={150} height={80} className="cursor-pointer"/>
          </Link>
          
          {/* Navigation */}
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
                  className={`relative text-gray-700 hover:text-[#03438f] transition-colors font-medium ${
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
          
          {/* Login Button */}
          <button className="bg-[#03438f] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#012f65] cursor-pointer text-sm">
            {layoutContent.header.loginText}
          </button>
          </div>
        </div>
      </div>
    </header>
  );
}
