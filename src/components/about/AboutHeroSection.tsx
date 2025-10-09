import aboutContent from '@/content/about.json';

interface AboutHeroSectionProps {
  className?: string;
}

export default function AboutHeroSection({ className = '' }: AboutHeroSectionProps) {
  return (
    <section className={`relative z-10 mt-24 pt-24 pb-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Hero Content */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-6">
            {aboutContent.hero.titleLines[0]} <span className="font-extrabold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">{aboutContent.hero.highlightedText}</span> {aboutContent.hero.titleLines[1]}
          </h1>
          <p className="text-lg md:text-2xl text-white/90 leading-relaxed mx-auto max-w-4xl">
            {aboutContent.hero.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
