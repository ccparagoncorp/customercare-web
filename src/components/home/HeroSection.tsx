import homeContent from '@/content/home.json';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  return (
    <main className={`relative z-10 flex items-center mt-24 justify-left min-h-screen pt-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-left max-w-7xl flex flex-col gap-48">        
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white leading-tight text-left">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-48"></div>
              <div className="w-5 h-5 bg-white rotate-45"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-48"></div>
            </div>
            {homeContent.hero.titleLines[0]} <br></br><span className="font-extrabold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">{homeContent.hero.titleLines[1]}</span>
          </h1>
          <div className="text-left max-w-3xl mx-0 space-y-3">
            {homeContent.hero.taglines.map((tagline, index) => (
              <div key={index} className="text-2xl md:text-3xl text-white font-medium">
                {tagline}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
