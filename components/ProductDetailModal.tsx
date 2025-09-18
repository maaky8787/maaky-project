import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useStoreSettings } from '../hooks/useStoreSettings';
import Modal from './Modal';
import PlusIcon from './icons/PlusIcon';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const { settings } = useStoreSettings();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string>('');
    
    // الأحجام المتاحة للملابس
    const availableSizes = product.available_sizes || ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    const handleAddToCart = async () => {
        // التحقق من اختيار الحجم للملابس
        if (product.category === 'ملابس' && !selectedSize) {
            alert('يرجى اختيار الحجم');
            return;
        }
        
        setIsAdding(true);
        // محاكاة تأخير قصير للتفاعل
        await new Promise(resolve => setTimeout(resolve, 300));
        
        for (let i = 0; i < quantity; i++) {
            addToCart(product, selectedSize);
        }
        
        setIsAdding(false);
        onClose();
    };

    const handleQuantityChange = (change: number) => {
        setQuantity(prev => Math.max(1, prev + change));
    };

    return (
        <Modal onClose={onClose}>
            <div className="relative max-w-7xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
                {/* زر الإغلاق */}
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-200 shadow-lg"
                >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* قسم الصورة - بالعرض */}
                    <div className="relative group">
                        <div className="aspect-[4/3] lg:aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                            <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                        </div>
                        
                        {/* شارة المنتج المميز */}
                        {product.is_featured && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                ⭐ منتج مميز
                            </div>
                        )}
                        
                        {/* تأثيرات بصرية محسنة للتباين */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* قسم التفاصيل - بالعرض */}
                    <div className="p-8 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-gray-900 to-black text-white">
                        <div>
                            {/* الفئة مع تباين محسن */}
                            <div className="mb-4">
                                <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                    {product.category}
                                </span>
                            </div>

                            {/* اسم المنتج مع تباين قوي */}
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                                {product.name}
                            </h1>

                            {/* الوصف مع تباين محسن */}
                            <div className="mb-8">
                                <p className="text-lg text-gray-100 leading-relaxed drop-shadow-md">
                                    {product.description}
                                </p>
                            </div>

                            {/* السعر مع تباين قوي */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                                        {product.price.toFixed(2)}
                                    </span>
                                    <span className="text-xl text-gray-200 font-medium drop-shadow-md">
                                        {settings.currency}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* قسم الإضافة للسلة */}
                        <div className="space-y-6">
                            {/* اختيار الكمية مع تباين محسن */}
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-semibold text-white drop-shadow-md">الكمية:</span>
                                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full p-1">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="w-10 h-10 rounded-full bg-white/30 shadow-md flex items-center justify-center hover:bg-white/40 transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="px-6 py-2 text-lg font-bold text-white min-w-[3rem] text-center drop-shadow-md">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-10 h-10 rounded-full bg-white/30 shadow-md flex items-center justify-center hover:bg-white/40 transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* اختيار الحجم للملابس */}
                            {product.category === 'ملابس' && (
                                <div className="space-y-3">
                                    <span className="text-lg font-semibold text-white drop-shadow-md">اختر الحجم:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                                                    selectedSize === size
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                                                        : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedSize && (
                                        <div className="text-sm text-green-300 drop-shadow-md">
                                            ✓ تم اختيار الحجم: {selectedSize}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* زر الإضافة للسلة مع تباين قوي */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`w-full py-4 px-8 rounded-2xl font-bold text-xl transition-all duration-300 transform shadow-xl hover:shadow-2xl ${
                                    isAdding 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95'
                                } text-white flex items-center justify-center gap-3 drop-shadow-lg`}
                            >
                                {isAdding ? (
                                    <>
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        جاري الإضافة...
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon />
                                        إضافة للسلة
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                            {quantity}
                                        </span>
                                    </>
                                )}
                            </button>

                            {/* معلومات إضافية مع تباين محسن */}
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <div className="text-2xl mb-1 drop-shadow-md">🚚</div>
                                    <div className="text-sm font-semibold text-white drop-shadow-md">شحن سريع</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <div className="text-2xl mb-1 drop-shadow-md">🔄</div>
                                    <div className="text-sm font-semibold text-white drop-shadow-md">إرجاع مجاني</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProductDetailModal;