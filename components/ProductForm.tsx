import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductFormProps {
    product?: Product;
    onSubmit: (product: Product) => void;
    onCancel: () => void;
}

const EMPTY_PRODUCT: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '', // Empty initially
    is_featured: false,
};

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Product>(product || EMPTY_PRODUCT);
    const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);

    useEffect(() => {
        setFormData(product || EMPTY_PRODUCT);
        setImagePreview(product?.image_url || null);
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormData(prev => ({ ...prev, image_url: result }));
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // إذا لم يتم رفع صورة، استخدم صورة افتراضية
        const finalFormData = {
            ...formData,
            image_url: formData.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'
        };
        
        onSubmit(finalFormData);
    };
    
    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 bg-gray-50 text-gray-900 placeholder:text-gray-500";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">اسم المنتج</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="مثال: ساعة كلاسيكية"/>
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-800 mb-1">السعر</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className={inputClasses} placeholder="0.00"/>
            </div>
             <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-800 mb-1">صورة المنتج</label>
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} className={`${inputClasses} p-2 h-auto`}/>
                {imagePreview && <img src={imagePreview} alt="معاينة المنتج" className="mt-4 w-32 h-32 object-cover rounded-md" />}
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-1">الوصف</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className={`${inputClasses} resize-none`} placeholder="وصف قصير وجذاب للمنتج..."></textarea>
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-800 mb-1">الفئة</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required className={inputClasses} placeholder="مثال: ساعات، محافظ، ملابس"/>
            </div>
            <div className="flex items-center">
                <input type="checkbox" id="is_featured" name="is_featured" checked={formData.is_featured} onChange={handleCheckboxChange} className="h-4 w-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800"/>
                <label htmlFor="is_featured" className="mr-2 block text-sm text-gray-900">منتج مميز</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">حفظ</button>
            </div>
        </form>
    );
};

export default ProductForm;