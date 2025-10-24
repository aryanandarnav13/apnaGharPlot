import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaRulerCombined } from 'react-icons/fa';

const PlotCard = ({ plot }) => {
  const { t, i18n } = useTranslation();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-secondary text-white';
      case 'booked':
        return 'bg-accent text-white';
      case 'sold':
        return 'bg-neutral-400 text-white';
      default:
        return 'bg-neutral-500 text-white';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPriceDisplay = () => {
    // If show_price is false or price_display is hidden, show "Contact for Price"
    if (!plot.show_price || plot.price_display === 'hidden') {
      return i18n.language === 'hi' ? 'मूल्य के लिए संपर्क करें' : 'Contact for Price';
    }

    // If price_display is masked, show masked price (e.g., xx00000)
    // Mask significant digits, keep trailing zeros
    if (plot.price_display === 'masked') {
      // Convert to integer to remove any decimals
      const priceInt = Math.floor(parseFloat(plot.price));
      const priceStr = priceInt.toString();
      
      // Find where trailing zeros start
      let significantEnd = priceStr.length;
      for (let i = priceStr.length - 1; i >= 0; i--) {
        if (priceStr[i] !== '0') {
          significantEnd = i + 1;
          break;
        }
      }
      
      // Mask the significant part, keep trailing zeros
      const significantPart = priceStr.substring(0, significantEnd);
      const trailingZeros = priceStr.substring(significantEnd);
      const masked = 'x'.repeat(significantPart.length) + trailingZeros;
      
      return `₹${masked}`;
    }

    // Default: show exact price
    return formatPrice(plot.price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary">
      <div className="relative">
        <img
          src={plot.image || 'https://via.placeholder.com/400x300'}
          alt={plot.plot_number}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full font-semibold text-sm shadow-lg ${getStatusColor(plot.status)} capitalize`}>
          {t(`plot.${plot.status}`)}
        </span>
      </div>
      
      <div className="p-5 bg-white">
        <h3 className={`text-xl font-bold text-neutral-800 mb-2 ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
          {t('plot.plotNumber')} {plot.plot_number}
        </h3>
        
        <div className="flex items-center text-neutral-700 mb-2">
          <FaRulerCombined className="mr-2 text-secondary" />
          <span className="font-semibold">{plot.size}</span>
        </div>
        
        {plot.location && (
          <div className="flex items-center text-gray-600 mb-3">
            <FaMapMarkerAlt className="mr-2 text-secondary" />
            <span className={`text-sm ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{plot.location}</span>
          </div>
        )}
        
        <p className={`text-gray-600 text-sm mb-4 line-clamp-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
          {plot.description || 'Premium plot with modern amenities'}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm text-gray-500 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('plot.price')}</p>
            <p className={`${(!plot.show_price || plot.price_display === 'hidden') ? 'text-sm' : 'text-2xl'} font-bold text-primary ${i18n.language === 'hi' ? 'font-hindi' : ''} ${(!plot.show_price || plot.price_display === 'hidden') ? '' : (i18n.language === 'hi' ? 'text-xl' : '')}`}>
              {getPriceDisplay()}
            </p>
          </div>
          
          <Link
            to={`/plots/${plot.id}`}
            className={`bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition text-sm ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
          >
            {t('plot.viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlotCard;

