import faqContent from '@/content/faq.json';

interface FAQHeroSectionProps {
  className?: string;
}

export default function FAQHeroSection({ className = '' }: FAQHeroSectionProps) {
  const title = faqContent.hero.title;
  return (
    <section className={`relative h-[60vh] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${faqContent.hero.backgroundImage}')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-5xl lg:text-6xl  leading-tight mb-6 font-extrabold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
          {title} 
        </h1>
        <p className="text-lg md:text-2xl text-white/90 leading-relaxed mx-auto max-w-4xl">
          {faqContent.hero.subtitle}
        </p>
      </div>
      
    </section>
  );
}
