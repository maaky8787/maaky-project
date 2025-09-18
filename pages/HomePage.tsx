import React, { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../services/supabaseService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import FeaturedProductCard from '../components/FeaturedProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل المنتجات.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const { featuredProducts, regularProducts, categories } = useMemo(() => {
    const featured = products.filter(p => p.is_featured);
    const regular = products.filter(p => !p.is_featured);
    const uniqueCategories = ['الكل', ...new Set(products.map(p => p.category))];
    return { featuredProducts: featured, regularProducts: regular, categories: uniqueCategories };
  }, [products]);

 
  


  const filteredProducts = useMemo(() => {
      if (selectedCategory === 'الكل') {
          return regularProducts;
      }
      return regularProducts.filter(p => p.category === selectedCategory);
  }, [selectedCategory, regularProducts]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
             <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-800"></div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div>
      {featuredProducts.length > 0 && (
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black w-full overflow-hidden">
          {/* خلفية ديكورية */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          
          <div className="relative z-10 p-4 sm:p-6 md:p-8">
            {/* عنوان القسم */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
                منتجاتنا المميزة
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                اكتشف أحدث وأفضل المنتجات المختارة بعناية من أجلك
              </p>
            </div>

            {/* منطقة المنتجات المميزة */}
            <div 
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] max-w-7xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
            {featuredProducts.map((product, index) => (
              <FeaturedProductCard 
                key={product.id} 
                product={product} 
                isActive={index === currentFeaturedIndex}
                onViewDetails={handleProductClick}
              />
            ))}
              
              {/* أزرار التنقل */}
              {featuredProducts.length > 1 && (
                <>
                  {/* زر السابق */}
                  <button
                    onClick={() => setCurrentFeaturedIndex(prev => 
                      prev === 0 ? featuredProducts.length - 1 : prev - 1
                    )}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20"
                  >
                    <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* زر التالي */}
                  <button
                    onClick={() => setCurrentFeaturedIndex(prev => 
                      prev === featuredProducts.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20"
                  >
                    <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* مؤشرات التنقل */}
            {featuredProducts.length > 1 && (
              <div className="flex justify-center mt-8 space-x-3">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeaturedIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentFeaturedIndex
                        ? 'bg-white scale-125' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <section className="mt-6 sm:mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center sm:text-right">جميع المنتجات</h2>
          
          <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
              {categories.map(category => (
                  <button 
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                          selectedCategory === category
                          ? 'bg-gray-900 text-white shadow'
                          : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                      }`}
                  >
                      {category}
                  </button>
              ))}
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onCardClick={handleProductClick} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
              <p className="text-center text-gray-700 col-span-full py-8">لا توجد منتجات في هذه الفئة.</p>
          )}
        </section>
      </div>

      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />}
    </div>
  );
};

export default HomePage;