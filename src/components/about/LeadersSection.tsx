import Image from 'next/image';
import aboutContent from '@/content/about.json';

interface LeadersSectionProps {
  className?: string;
}

export default function LeadersSection({ className = '' }: LeadersSectionProps) {
  return (
    <section className={`py-24 bg-white relative ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {aboutContent.leaders.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {aboutContent.leaders.subtitle}
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-32"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="h-px bg-gradient-to-l from-transparent via-gray-300 to-transparent flex-1 max-w-32"></div>
          </div>
        </div>

        {/* Single Leader - Centered */}
        <div className="flex justify-center">
          <div className="max-w-lg w-full">
          {aboutContent.leaders.members.map((leader, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2"
            >
              {/* Cool Image with Overlay */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
              </div>
              
              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {leader.name}
                </h3>
                <p className="text-blue-600 font-semibold text-base mb-4">
                  {leader.position}
                </p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {leader.description}
                </p>
                
                {/* Cool Bottom Line */}
                <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center mx-auto"></div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
