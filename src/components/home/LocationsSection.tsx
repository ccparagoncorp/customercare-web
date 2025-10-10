'use client';
import homeContent from '@/content/home.json';

interface LocationProps {
  title: string;
  address: string;
  mapUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationsSectionProps {
  className?: string;
}

const locations: LocationProps[] = (homeContent.locations.items as any).map((l: any) => ({
  title: l.title,
  address: l.address,
  mapUrl: l.mapUrl,
  coordinates: { lat: 0, lng: 0 }
}));

export default function LocationsSection({ className = '' }: LocationsSectionProps) {
  return (
    <section className={`py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f8f9fa] via-[#ffffff] to-[#f1f3f4] relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-[#03438f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-r from-[#03438f]/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#03438f] mb-6 sm:mb-8 leading-tight">
            {homeContent.locations.title}
          </h2>
          
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-[#03438f]/30 to-transparent flex-1 max-w-16 sm:max-w-24 md:max-w-32"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#03438f] rotate-45"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#03438f]/30 to-transparent flex-1 max-w-16 sm:max-w-24 md:max-w-32"></div>
          </div>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            {homeContent.locations.subtitle}
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          {locations.map((location, index) => (
            <div 
              key={index} 
              className="group relative"
            >
              {/* Location Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#03438f]/20 rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white hover:shadow-2xl hover:shadow-[#03438f]/10 transition-all duration-500 hover:scale-[1.02] group-hover:border-[#03438f]/30 flex flex-col h-full">
                {/* Card Header */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#03438f] mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {location.title}
                  </h3>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#03438f]/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#03438f]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                      {location.address}
                    </p>
                  </div>
                </div>

                {/* Map Container */}
                <div className="relative flex-grow">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border border-gray-300/50 overflow-hidden h-48 sm:h-56 md:h-64 group-hover:border-[#03438f]/30 transition-colors duration-300">
                    {location.mapUrl ? (
                      <iframe
                        src={location.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-[#03438f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#03438f]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                          </div>
                          <p className="text-gray-600 font-medium">Interactive Map</p>
                          <p className="text-gray-500 text-sm">Google Maps integration</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Map Overlay Info */}
                  <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-white/90 backdrop-blur-sm border border-[#03438f]/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-[#03438f] text-xs sm:text-sm font-medium">Live Location</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Progress Line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#03438f] via-blue-600 to-[#03438f] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#03438f]/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-110 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center gap-2 sm:gap-4">
            <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#03438f]/30"></div>
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#03438f] rounded-full animate-pulse"></div>
            <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#03438f]/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
