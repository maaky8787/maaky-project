import React from 'react';
import { Product } from '../types';
import { useStoreSettings } from '../hooks/useStoreSettings';

interface ProductCardProps {
  product: Product;
  onCardClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCardClick }) => {
  const { settings } = useStoreSettings();

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-3 flex flex-col h-full cursor-pointer border border-gray-100"
      onClick={() => onCardClick(product)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onCardClick(product)}
    >
      {/* قسم الصورة */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        
        {/* شارة المنتج المميز */}
        {product.is_featured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ⭐ مميز
          </div>
        )}
        
        {/* تأثيرات بصرية */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* زر العرض السريع */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* قسم المحتوى */}
      <div className="p-6 flex flex-col flex-grow">
        {/* الفئة */}
        <div className="mb-3">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.category}
          </span>
        </div>
        
        {/* اسم المنتج مع تباين محسن */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors drop-shadow-sm">
          {product.name}
        </h3>
        
        {/* الوصف مع تباين محسن */}
        <p className="text-gray-700 text-sm flex-grow line-clamp-3 leading-relaxed drop-shadow-sm">
          {product.description}
        </p>
        
        {/* السعر مع تباين محسن */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
              {product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600 font-medium drop-shadow-sm">
              {settings.currency}
            </span>
          </div>
          
          {/* أيقونة السهم */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;