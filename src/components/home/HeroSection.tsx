import homeContent from '@/content/home.json';
import { SimpleFadeIn, FloatingParticles } from '@/components/animations';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  return (
    <main className={`relative z-10 flex items-center mt-16 sm:mt-20 md:mt-24 justify-left min-h-screen pt-16 sm:pt-20 md:pt-24 ${className}`}>
      {/* Floating Particles */}
      <FloatingParticles count={30} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-left max-w-7xl flex flex-col gap-16 sm:gap-24 md:gap-32 lg:gap-48">
          <SimpleFadeIn delay={0.2}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-medium text-white leading-tight text-left">
              <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-16 sm:max-w-24 md:max-w-48"></div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-white rotate-45"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-16 sm:max-w-24 md:max-w-48"></div>
              </div>
              {homeContent.hero.titleLines[0]} <br></br><span className="font-extrabold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">{homeContent.hero.titleLines[1]}</span>
            </h1>
          </SimpleFadeIn>
          
          <SimpleFadeIn delay={0.4}>
            <div className="text-left max-w-3xl mx-0 space-y-2 sm:space-y-3">
              {homeContent.hero.taglines.map((tagline, index) => (
                <div key={index} className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-medium">
                  {tagline}
                </div>
              ))}
            </div>
          </SimpleFadeIn>
        </div>
      </div>
    </main>
  );
}
