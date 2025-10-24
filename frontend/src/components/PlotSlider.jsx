import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PlotCard from './PlotCard';

const PlotSlider = ({ plots }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Determine how many plots to show at once based on screen size
  const [plotsPerView, setPlotsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPlotsPerView(1);
      } else if (window.innerWidth < 1024) {
        setPlotsPerView(2);
      } else {
        setPlotsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!isPaused && plots.length > plotsPerView) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => 
          prev >= plots.length - plotsPerView ? 0 : prev + 1
        );
      }, 5000); // Slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused, plots.length, plotsPerView]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, plots.length - plotsPerView) : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => 
      prev >= plots.length - plotsPerView ? 0 : prev + 1
    );
  };

  if (!plots || plots.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No plots available at the moment.</p>
      </div>
    );
  }

  // If plots are less than or equal to plotsPerView, show them all without navigation
  if (plots.length <= plotsPerView) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plots.map((plot) => (
          <PlotCard key={plot.id} plot={plot} />
        ))}
      </div>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-xl transition-all hover:scale-105"
        aria-label="Previous"
      >
        <FaChevronLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-xl transition-all hover:scale-105"
        aria-label="Next"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Plots Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / plotsPerView)}%)`
          }}
        >
          {plots.map((plot) => (
            <div
              key={plot.id}
              className="flex-shrink-0 px-4"
              style={{ width: `${100 / plotsPerView}%` }}
            >
              <PlotCard plot={plot} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(plots.length - plotsPerView + 1) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index
                ? 'bg-bihar-red w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PlotSlider;

