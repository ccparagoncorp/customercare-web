import { ReactNode } from 'react';
import BackgroundOverlay from './BackgroundOverlay';

interface LandingPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function LandingPageLayout({ children, className = '' }: LandingPageLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden ${className}`}>
      <BackgroundOverlay />
      {children}
    </div>
  );
}
