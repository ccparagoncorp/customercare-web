import aboutContent from '@/content/about.json';
import { SimpleFadeIn } from '@/components/animations';

interface AboutHeroSectionProps {
  className?: string;
}

export default function AboutHeroSection({ className = '' }: AboutHeroSectionProps) {
  return (
    <section className={`relative z-10 mt-16 sm:mt-20 md:mt-24 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Hero Content */}
        <div className="text-center">
          <SimpleFadeIn delay={0.2}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-white leading-tight mb-4 sm:mb-6">
              {aboutContent.hero.titleLines[0]} <span className="font-extrabold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">{aboutContent.hero.highlightedText}</span> {aboutContent.hero.titleLines[1]}
            </h1>
          </SimpleFadeIn>
          
          <SimpleFadeIn delay={0.4}>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed mx-auto max-w-4xl px-4">
              {aboutContent.hero.subtitle}
            </p>
          </SimpleFadeIn>
        </div>
      </div>
    </section>
  );
}
