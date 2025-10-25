import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaBed, FaBath, FaRulerCombined, FaRupeeSign } from 'react-icons/fa';

// Inline SVG fallback image (no external dependencies)
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

const HouseDesignCard = ({ design }) => {
  const { i18n } = useTranslation();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-bihar-yellow">
      <div className="relative">
        <img
          src={design.image || FALLBACK_IMAGE}
          alt={design.name}
          className="w-full h-56 object-cover"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <h3 className={`absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-lg ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
          {design.name}
        </h3>
      </div>
      
      <div className="p-5 bg-white">
        <p className={`text-gray-700 mb-4 line-clamp-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
          {design.description}
        </p>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center bg-gradient-to-br from-bihar-red/10 to-bihar-orange/10 rounded-lg py-3">
            <FaBed className="text-bihar-red mx-auto mb-1" size={20} />
            <p className={`text-sm text-gray-700 font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{design.bedrooms} Beds</p>
          </div>
          <div className="text-center bg-gradient-to-br from-bihar-orange/10 to-bihar-yellow/10 rounded-lg py-3">
            <FaBath className="text-bihar-orange mx-auto mb-1" size={20} />
            <p className={`text-sm text-gray-700 font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{design.bathrooms} Baths</p>
          </div>
          <div className="text-center bg-gradient-to-br from-bihar-yellow/10 to-bihar-green/10 rounded-lg py-3">
            <FaRulerCombined className="text-bihar-green mx-auto mb-1" size={20} />
            <p className={`text-sm text-gray-700 font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{design.size}</p>
          </div>
        </div>
        
        <div className="border-t-2 border-bihar-yellow/30 pt-4">
          <p className={`text-sm text-gray-500 mb-1 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>Estimated Cost</p>
          <p className="text-xl font-bold text-bihar-red flex items-center">
            <FaRupeeSign className="mr-1" size={18} />
            {formatPrice(design.estimated_cost)}
          </p>
        </div>
        
        {design.features && (
          <div className="mt-4">
            <p className={`text-sm text-gray-500 mb-2 font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>Features</p>
            <div className="flex flex-wrap gap-2">
              {JSON.parse(design.features).slice(0, 3).map((feature, index) => (
                <span key={index} className={`bg-gradient-to-r from-bihar-orange to-bihar-yellow text-white px-3 py-1 rounded-full text-xs font-semibold shadow ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseDesignCard;

