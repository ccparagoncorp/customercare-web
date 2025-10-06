'use client';

import Link from 'next/link';
import Image from 'next/image';
import homeContent from '@/content/home.json';

interface FooterSectionProps {
  className?: string;
}

export default function FooterSection({ className = '' }: FooterSectionProps) {
  return (
    <footer className={`bg-gradient-to-br from-[#141825] via-[#0f1419] to-[#0a0e13] relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info Column */}
            <div className="lg:col-span-1">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <Image src={homeContent.footer.company.logo} alt="Logo" width={150} height={80}/>
              </div>

              {/* Tagline */}
              <p className="text-white text-xl font-semibold mb-4">
                {homeContent.footer.company.tagline}
              </p>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {homeContent.footer.company.description}
              </p>

              {/* Social Media Links (Instagram, TikTok only) */}
              <div className="flex items-center gap-4">
                {/* Instagram */}
                <Link href={homeContent.footer.social[0].url} aria-label="Instagram" className="group w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#03438f] transition-colors duration-300">
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 3a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM17.5 6.25a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
                  </svg>
                </Link>
                {/* TikTok */}
                <Link href={homeContent.footer.social[1].url} aria-label="TikTok" className="group w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#03438f] transition-colors duration-300">
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2h3.1A6.9 6.9 0 0023 8.9V12a9.5 9.5 0 01-6.1-2v7.1A5.9 5.9 0 1111 11.2V14a3.1 3.1 0 103.1-3.1V2z"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {homeContent.footer.links.quick.map((name: string, index: number) => (
                  <li key={index}>
                    <Link 
                      href="#" 
                      className="group text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-[#03438f] mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-4">
                {homeContent.footer.links.support.map((name: string, index: number) => (
                  <li key={index}>
                    <Link 
                      href="#" 
                      className="group text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-[#03438f] mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info Column */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Contact Info</h4>
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-center gap-3 group">
                  <div className="p-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#03438f] transition-colors duration-300">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{homeContent.footer.contact.phone}</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 group">
                  <div className="p-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#03438f] transition-colors duration-300">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{homeContent.footer.contact.email}</span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 group">
                  <div className="p-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#03438f] transition-colors duration-300 mt-1">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm leading-relaxed">
                      {homeContent.footer.contact.addressLines[0]}<br />
                      {homeContent.footer.contact.addressLines[1]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-white/10"></div>

        {/* Copyright Section */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                {homeContent.footer.copyright}
              </p>
            </div>
            
            {/* Additional Links */}
            <div className="flex items-center gap-6">
              {homeContent.footer.links.legal.map((name: string, index: number) => (
                <Link key={index} href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
