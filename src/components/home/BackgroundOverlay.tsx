interface BackgroundOverlayProps {
  backgroundImage?: string;
  overlayOpacity?: number;
  className?: string;
}

export default function BackgroundOverlay({ 
  backgroundImage = 'bg.png',
  overlayOpacity = 0.5,
  className = ''
}: BackgroundOverlayProps) {
  return (
    <>
      {/* Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${className}`}
        style={{
          backgroundImage: `url('/${backgroundImage}')`,
        }}
      />
      
      {/* Blue Overlay */}
      <div 
        className="" 
        style={{ opacity: overlayOpacity }}
      />
    </>
  );
}
