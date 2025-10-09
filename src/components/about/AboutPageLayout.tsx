import { ReactNode } from 'react';
import AboutBackgroundOverlay from './AboutBackgroundOverlay';

interface AboutPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function AboutPageLayout({ children, className = '' }: AboutPageLayoutProps) {
  return (
    <div className={`min-h-[60vh] relative overflow-hidden ${className}`}>
      <AboutBackgroundOverlay />
      {children}
    </div>
  );
}
