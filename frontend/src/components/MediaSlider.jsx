import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';

// Inline SVG fallback image (no external dependencies)
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';

const MediaSlider = ({ media = [], autoSlide = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Determine if current item is a video
  const isVideo = (item) => {
    if (typeof item === 'object' && item.type) return item.type === 'video';
    if (typeof item === 'string') {
      const videoExtensions = /\.(mp4|avi|mov|wmv|webm|mkv)(\?.*)?$/i;
      return videoExtensions.test(item);
    }
    return false;
  };

  // Get media URL
  const getMediaUrl = (item) => {
    if (typeof item === 'object' && item.url) return item.url;
    return item;
  };

  // Auto slide functionality (skip auto-slide for videos)
  useEffect(() => {
    if (!autoSlide || !media || media.length <= 1) return;
    
    const currentMedia = media[currentIndex];
    if (isVideo(currentMedia)) return; // Don't auto-slide on videos

    const slideTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === media.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(slideTimer);
  }, [autoSlide, interval, media, currentIndex]);

  // Reset video when changing slides
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [currentIndex]);

  if (!media || media.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No media available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle single media or array
  const mediaArray = Array.isArray(media) ? media : [media];
  const currentMedia = mediaArray[currentIndex];
  const currentMediaUrl = getMediaUrl(currentMedia);
  const currentIsVideo = isVideo(currentMedia);

  // Process URL - handle both Cloudinary URLs and legacy local uploads
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BACKEND_URL = API_URL.replace('/api', '');
  
  const processUrl = (url) => {
    // If it's already a full URL (Cloudinary or external), use as-is
    if (url?.startsWith('http://') || url?.startsWith('https://')) {
      return url;
    }
    // If it's a legacy local path, prepend backend URL
    if (url?.startsWith('/uploads')) {
      return `${BACKEND_URL}${url}`;
    }
    return url;
  };

  return (
    <div className="relative w-full group">
      {/* Main Media Display */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg bg-black">
        {currentIsVideo ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={processUrl(currentMediaUrl)}
              className="w-full h-full object-contain"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                // Auto advance to next slide after video ends
                if (currentIndex < mediaArray.length - 1) {
                  setTimeout(() => goToNext(), 1000);
                }
              }}
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Video Play/Pause Overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity"
              onClick={toggleVideoPlay}
            >
              {!isPlaying && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition">
                  <FaPlay className="text-white text-4xl ml-2" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <img
            src={processUrl(currentMediaUrl) || FALLBACK_IMAGE}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-500"
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
            }}
          />
        )}

        {/* Media counter & type badge */}
        {mediaArray.length > 1 && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {mediaArray.length}
            </div>
            {currentIsVideo && (
              <div className="bg-bihar-red text-white px-3 py-1 rounded-full text-xs font-bold">
                VIDEO
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Arrows - Show only if more than 1 media item */}
      {mediaArray.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-10"
            aria-label="Previous media"
          >
            <FaChevronLeft size={20} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-10"
            aria-label="Next media"
          >
            <FaChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots Indicator - Show only if more than 1 media item */}
      {mediaArray.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {mediaArray.map((item, index) => {
            const itemIsVideo = isVideo(item);
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative group/dot ${
                  index === currentIndex 
                    ? 'w-8 h-3' 
                    : 'w-3 h-3'
                } rounded-full transition-all duration-300 ${
                  itemIsVideo
                    ? (index === currentIndex ? 'bg-bihar-red' : 'bg-bihar-orange/50 hover:bg-bihar-orange')
                    : (index === currentIndex ? 'bg-bihar-yellow' : 'bg-gray-300 hover:bg-gray-400')
                }`}
                aria-label={`Go to ${itemIsVideo ? 'video' : 'image'} ${index + 1}`}
                title={itemIsVideo ? 'Video' : 'Image'}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaSlider;

