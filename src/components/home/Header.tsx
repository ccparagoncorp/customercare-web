import Link from 'next/link';
import Image from 'next/image';
import homeContent from '@/content/home.json';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      {/* White Navbar Container */}
      <div className="bg-white backdrop-blur-sm mx-48 lg:mx-48 mt-6 shadow-xl rounded-full">
        <div className="flex items-center justify-between py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Image src={homeContent.header.logo} alt="Logo" width={150} height={80}/>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {homeContent.header.nav.map((label) => (
              <Link key={label} href="#" className="text-gray-700 hover:text-[#03438f] transition-colors font-medium">
                {label}
              </Link>
            ))}
          </nav>
          
          {/* Login Button */}
          <button className="bg-[#03438f] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#012f65] cursor-pointer text-sm">
            {homeContent.header.loginText}
          </button>
        </div>
      </div>
    </header>
  );
}
