import React from 'react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useStoreSettings } from '../hooks/useStoreSettings';

interface FeaturedProductCardProps {
  product: Product;
  isActive: boolean;
  onViewDetails?: (product: Product) => void;
}

const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({ product, isActive, onViewDetails }) => {
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();

  return (
    <div
      className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 ease-in-out transform ${
        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      }`}
      aria-hidden={!isActive}
    >
      {/* صورة المنتج مع تأثيرات */}
      <div className="relative w-full h-full">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" 
        />
        
        {/* طبقة متدرجة محسنة */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        {/* تأثيرات إضافية */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20"></div>
      </div>

      {/* محتوى المنتج */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
        <div className="max-w-4xl">
          {/* شارة المنتج المميز */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold rounded-full mb-4 shadow-lg">
            ⭐ منتج مميز
          </div>
          
          {/* اسم المنتج مع تباين قوي */}
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white drop-shadow-2xl">
            {product.name}
          </h3>
          
          {/* وصف المنتج مع تباين محسن */}
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mb-6 leading-relaxed text-gray-100 drop-shadow-lg">
            {product.description}
          </p>
          
          {/* السعر والفئة مع تباين قوي */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-2xl">
                {product.price.toFixed(2)} {settings.currency}
              </span>
              <span className="px-3 py-1 bg-white/30 backdrop-blur-sm text-white text-sm font-medium rounded-full drop-shadow-lg border border-white/20">
                {product.category}
              </span>
            </div>
          </div>
          
          {/* أزرار العمل */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => addToCart(product)}
              className="group bg-gradient-to-r from-white to-gray-100 text-gray-900 font-bold py-4 px-8 rounded-full hover:from-gray-100 hover:to-white transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              أضف إلى السلة
            </button>
            
            <button 
              onClick={() => onViewDetails?.(product)}
              className="group border-2 border-white/30 text-white font-bold py-4 px-8 rounded-full hover:bg-white/10 transition-all duration-300 text-lg backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              عرض التفاصيل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductCard;