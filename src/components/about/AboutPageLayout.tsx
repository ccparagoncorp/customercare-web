import { ReactNode } from 'react';
import AboutBackgroundOverlay from './AboutBackgroundOverlay';

interface AboutPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function AboutPageLayout({ children, className = '' }: AboutPageLayoutProps) {
  return (
    <div className={`sm:min-h-[60vh] min-h-[35vh] relative overflow-hidden ${className}`}>
      <AboutBackgroundOverlay />
      {children}
    </div>
  );
}
