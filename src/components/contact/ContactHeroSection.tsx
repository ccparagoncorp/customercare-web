import contactContent from '@/content/contact.json';

interface ContactHeroSectionProps {
  className?: string;
}

export default function ContactHeroSection({ className = '' }: ContactHeroSectionProps) {
  return (
    <section className={`relative h-[60vh] md:h-[60vh] flex items-center justify-center overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${contactContent.hero.backgroundImage}')` }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent leading-tight mb-6">
          {contactContent.hero.title}
        </h1>
        <p className="text-base md:text-xl text-blue-100/90 leading-relaxed mx-auto max-w-3xl">
          {contactContent.hero.subtitle}
        </p>
      </div>
    </section>
  );
}

