'use client';

import Image from 'next/image';
import homeContent from '@/content/home.json';

interface AchievementProps {
  image: string;
  title: string;
  year: string;
  alt: string;
  description?: string;
}

interface AchievementsSectionProps {
  className?: string;
}

const achievements: AchievementProps[] = homeContent.achievements.items as any;

export default function AchievementsSection({ className = '' }: AchievementsSectionProps) {
  return (
    <section className={`py-24 bg-gradient-to-b from-[#000000] to-[#00142c] relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            {homeContent.achievements.title}
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-32"></div>
            <div className="w-3 h-3 bg-white rotate-45"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-32"></div>
          </div>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {homeContent.achievements.subtitle}
          </p>
        </div>

        {/* Achievements List */}
        <div className="space-y-2">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className="group relative"
            >
              {/* Achievement Card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10">
                <div className="flex items-center justify-between">
                  {/* Achievement Image */}
                  <div className="flex-shrink-0 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-xl scale-110"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <Image
                        src={achievement.image}
                        alt={achievement.alt}
                        width={120}
                        height={120}
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Achievement Content */}
                  <div className="flex-grow mx-12 text-center">
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {achievement.title}
                      </h3>
                      {achievement.description && (
                        <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
                          {achievement.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Year Badge */}
                  <div className="flex-shrink-0 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg scale-110"></div>
                    <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                      <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                        {achievement.year}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/50 via-white to-white/50 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>

              {/* Connecting Line */}
              {index < achievements.length - 1 && (
                <div className="flex justify-center mt-8">
                  <div className="w-px h-16 bg-gradient-to-b from-white/30 via-white/10 to-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/30"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
