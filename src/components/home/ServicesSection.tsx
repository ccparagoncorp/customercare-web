'use client';
import homeContent from '@/content/home.json';

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
    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10 relative overflow-hidden h-[350px]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#03438f]/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#03438f]/20 to-transparent rounded-lg blur-md scale-110 group-hover:scale-125 transition-transform duration-300"></div>
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white ml-4 group-hover:text-blue-200 transition-colors duration-300">
            {title}
          </h3>
        </div>
        
        <p className="text-white/80 text-sm mb-6 leading-relaxed group-hover:text-white transition-colors duration-300">
          {description}
        </p>
        
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center group/item">
              <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform duration-300">
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
  );
}

export default function ServicesSection({ className = '' }: ServicesSectionProps) {
  return (
    <section className={`py-24 bg-gradient-to-br from-[#03438f] via-[#002149] to-[#00142c] relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
            {homeContent.services.title}
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-32"></div>
            <div className="w-3 h-3 bg-white rotate-45"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent flex-1 max-w-32"></div>
          </div>
          
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            {homeContent.services.subtitle}
          </p>
        </div>

        {/* Service Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{homeContent.services.categoriesTitle}</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-[#03438f] via-white to-[#03438f] mx-auto rounded-full"></div>
          </div>
          
          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
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
