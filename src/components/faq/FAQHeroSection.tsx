import faqContent from '@/content/faq.json';
import { SimpleFadeIn } from '@/components/animations';

interface FAQHeroSectionProps {
  className?: string;
}

export default function FAQHeroSection({ className = '' }: FAQHeroSectionProps) {
  const title = faqContent.hero.title;
  return (
    <section className={`relative sm:min-h-[60vh] min-h-[35vh] md:h-[60vh] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${faqContent.hero.backgroundImage}')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <SimpleFadeIn>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-4 sm:mb-6 font-extrabold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
            {title} 
          </h1>
        </SimpleFadeIn>
        
        <SimpleFadeIn delay={0.4}>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed mx-auto max-w-4xl">
            {faqContent.hero.subtitle}
          </p>
        </SimpleFadeIn>
      </div>
      
    </section>
  );
}
