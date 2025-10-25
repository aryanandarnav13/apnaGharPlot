import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Inline SVG fallback image (no external dependencies)
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';

const ImageSlider = ({ images, autoSlide = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide functionality
  useEffect(() => {
    if (!autoSlide || !images || images.length <= 1) return;

    const slideTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(slideTimer);
  }, [autoSlide, interval, images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Handle single image or array of images
  const imageArray = Array.isArray(images) ? images : [images];

  return (
    <div className="relative w-full group">
      {/* Main Image */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
        <img
          src={imageArray[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />

        {/* Image counter */}
        {imageArray.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {imageArray.length}
          </div>
        )}
      </div>

      {/* Navigation Arrows - Show only if more than 1 image */}
      {imageArray.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            aria-label="Previous image"
          >
            <FaChevronLeft size={20} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            aria-label="Next image"
          >
            <FaChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots Indicator - Show only if more than 1 image */}
      {imageArray.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {imageArray.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;

