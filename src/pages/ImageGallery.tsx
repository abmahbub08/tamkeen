import React, { useRef, useEffect } from 'react';

interface ImageGalleryProps {
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, currentImageIndex, setCurrentImageIndex }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const scrollToImage = (index: number) => {
        const imageWidth = scrollContainer.children[0].clientWidth;
        scrollContainer.scrollTo({
          left: imageWidth * index,
          behavior: 'smooth'
        });
      };

      scrollToImage(currentImageIndex);
    }
  }, [currentImageIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    scrollContainerRef.current?.setAttribute('data-touch-start-x', touch.clientX.toString());
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchStartX = scrollContainerRef.current?.getAttribute('data-touch-start-x');
    if (!touchStartX) return;

    const currentTouch = e.touches[0].clientX;
    const diff = parseInt(touchStartX) - currentTouch;

    if (diff > 50 && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      scrollContainerRef.current?.removeAttribute('data-touch-start-x');
    } else if (diff < -50 && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      scrollContainerRef.current?.removeAttribute('data-touch-start-x');
    }
  };

  const handleTouchEnd = () => {
    scrollContainerRef.current?.removeAttribute('data-touch-start-x');
  };

  return (
    <div className="space-y-4">
      <div 
        className="relative w-full overflow-x-auto scrollbar-hide"
        ref={scrollContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex space-x-4 pb-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 sm:w-80 md:w-96 aspect-square relative"
            >
              <img 
                src={`https://api.tamkeen.center/${img}`}
                alt={`Product View ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentImageIndex ? 'bg-sky-600' : 'bg-sky-200'
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

