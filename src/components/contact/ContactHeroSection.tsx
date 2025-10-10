import contactContent from '@/content/contact.json';
import { SimpleFadeIn } from '@/components/animations';

interface ContactHeroSectionProps {
  className?: string;
}

export default function ContactHeroSection({ className = '' }: ContactHeroSectionProps) {
  return (
    <section className={`relative min-h-[35vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${contactContent.hero.backgroundImage}')` }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 mt-16 sm:mt-0">
        <SimpleFadeIn delay={0.2}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent leading-tight mb-4 sm:mb-6">
            {contactContent.hero.title}
          </h1>
        </SimpleFadeIn>
        
        <SimpleFadeIn delay={0.4}>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100/90 leading-relaxed mx-auto max-w-3xl">
            {contactContent.hero.subtitle}
          </p>
        </SimpleFadeIn>
      </div>
    </section>
  );
}

