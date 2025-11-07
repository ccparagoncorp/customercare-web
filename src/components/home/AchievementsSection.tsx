'use client';

import Image from 'next/image';
import homeContent from '@/content/home.json';
import { ScrollAnimation, StaggerAnimation } from '@/components/animations';

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

const achievements: AchievementProps[] = homeContent.achievements.items as AchievementProps[];

export default function AchievementsSection({ className = '' }: AchievementsSectionProps) {
  return (
    <section className={`py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#000000] to-[#00142c] relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header */}
        <ScrollAnimation direction="up" delay={0.2}>
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              {homeContent.achievements.title}
            </h2>
            
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-16 sm:max-w-24 md:max-w-32"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rotate-45"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-16 sm:max-w-24 md:max-w-32"></div>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4">
              {homeContent.achievements.subtitle}
            </p>
          </div>
        </ScrollAnimation>

        {/* Achievements List */}
        <StaggerAnimation staggerDelay={0.2} direction="up">
          <div className="space-y-4 sm:space-y-6 md:space-y-2">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="group relative"
              >
              {/* Achievement Card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10">
                {/* Mobile Layout (Vertical) */}
                <div className="md:hidden flex flex-col items-center space-y-4">
                  {/* Year Badge - Mobile */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg scale-110"></div>
                    <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
                      <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                        {achievement.year}
                      </span>
                    </div>
                  </div>

                  {/* Achievement Image - Mobile */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-xl scale-110"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20">
                      <Image
                        src={achievement.image}
                        alt={achievement.alt}
                        width={80}
                        height={80}
                        className="object-contain transition-transform duration-300 group-hover:scale-110 sm:w-[100px] sm:h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Achievement Content - Mobile */}
                  <div className="text-center">
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                        {achievement.title}
                      </h3>
                      {achievement.description && (
                        <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                          {achievement.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout (Horizontal) */}
                <div className="hidden md:flex items-center justify-between">
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
                      <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
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
                      <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
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
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <div className="w-px h-8 sm:h-12 md:h-16 bg-gradient-to-b from-white/30 via-white/10 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </StaggerAnimation>

        {/* Bottom Decoration */}
        <div className="text-center mt-12 sm:mt-16 md:mt-20">
          <div className="inline-flex items-center gap-2 sm:gap-4">
            <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-white/30"></div>
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-white/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
