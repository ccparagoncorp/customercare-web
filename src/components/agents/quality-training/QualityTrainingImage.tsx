import Image from "next/image"
import { Image as ImageIcon } from "lucide-react"

interface QualityTrainingImageProps {
  item: { logos: string[] }
  size?: string
}

export function QualityTrainingImage({ item, size = 'w-64 h-64' }: QualityTrainingImageProps) {
  const logos = item.logos && item.logos.length > 0 ? item.logos[0] : null
  
  return (
    <div className={`${size} mx-auto rounded-lg overflow-hidden relative`}>
      {logos ? (
        <>
          <Image
            src={
              logos.startsWith('http') 
                ? logos 
                : logos.startsWith('/') 
                ? logos 
                : logos.startsWith('public/')
                ? logos.replace('public/', '/')
                : logos.startsWith('images/')
                ? `/${logos}`
                : `/images/${logos}`
            }
            alt="Quality Training"
            width={256}
            height={256}
            className="w-full h-full object-cover"
            priority={false}
            unoptimized={true}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = target.parentElement?.querySelector('.fallback-image') as HTMLElement;
              if (fallback) {
                target.style.display = 'none';
                fallback.classList.remove('hidden');
                fallback.classList.add('flex', 'items-center', 'justify-center');
              }
            }}
          />
          <div className="hidden fallback-image w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 absolute inset-0">
            <div className="text-center">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Image not found</p>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No Image</p>
          </div>
        </div>
      )}
    </div>
  )
}

