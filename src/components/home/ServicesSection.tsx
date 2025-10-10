'use client';
import homeContent from '@/content/home.json';
import { ScrollAnimation, StaggerAnimation, ScaleAnimation, GlowEffect } from '@/components/animations';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

interface ServicesSectionProps {
  className?: string;
}

const services: ServiceCardProps[] = homeContent.services.items.map((s) => ({
  icon: (
    <div className="w-12 h-12 bg-[#03438f] rounded-lg flex items-center justify-center">
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
    </div>
  ),
  title: s.title,
  description: s.description,
  features: s.features
}));

function ServiceCard({ icon, title, description, features }: ServiceCardProps) {
  return (
    <GlowEffect intensity={0.3} color="blue">
      <ScaleAnimation scale={0.9}>
        <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10 relative overflow-hidden h-auto sm:h-[320px] md:h-[350px] flex flex-col">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#03438f]/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center mb-4 sm:mb-6 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#03438f]/20 to-transparent rounded-lg blur-md scale-110 group-hover:scale-125 transition-transform duration-300"></div>
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white ml-3 sm:ml-4 group-hover:text-blue-200 transition-colors duration-300">
            {title}
          </h3>
        </div>
        
        <p className="text-white/80 text-sm mb-4 sm:mb-6 leading-relaxed group-hover:text-white transition-colors duration-300 flex-shrink-0">
          {description}
        </p>
        
        <div className="space-y-3 flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center group/item">
              <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-gray-200 text-sm group-hover:text-white transition-colors duration-300">
                {feature}
              </span>
            </div>
          ))}
        </div>

            {/* Bottom Progress Line */}
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#03438f] via-white to-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>
        </div>
      </ScaleAnimation>
    </GlowEffect>
  );
}

export default function ServicesSection({ className = '' }: ServicesSectionProps) {
  return (
    <section className={`py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#03438f] via-[#002149] to-[#00142c] relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header */}
        <ScrollAnimation direction="up" delay={0.2}>
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8">
              {homeContent.services.title}
            </h2>

            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-16 sm:max-w-24 md:max-w-32"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rotate-45"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-16 sm:max-w-24 md:max-w-32"></div>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed px-4">
              {homeContent.services.subtitle}
            </p>
          </div>
        </ScrollAnimation>

        {/* Service Categories */}
        <div className="mb-12 sm:mb-16">
          <ScrollAnimation direction="up" delay={0.3}>
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">{homeContent.services.categoriesTitle}</h3>
              <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-[#03438f] via-white to-[#03438f] mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>

          {/* Service Cards Grid */}
          <StaggerAnimation staggerDelay={0.15} direction="up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="group relative"
                >
                  <ServiceCard
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    features={service.features}
                  />

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#03438f]/20 to-blue-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-110 -z-10"></div>
                </div>
              ))}
            </div>
          </StaggerAnimation>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-16">
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
