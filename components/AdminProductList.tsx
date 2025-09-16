import React from 'react';
import { Product } from '../types';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import { useStoreSettings } from '../hooks/useStoreSettings';

interface AdminProductListProps {
    title: string;
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: number) => void;
}

const AdminProductList: React.FC<AdminProductListProps> = ({ title, products, onEdit, onDelete }) => {
    const { settings } = useStoreSettings();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h2>
            <div className="space-y-4">
                {products.length === 0 ? (
                    <p className="text-gray-700">لا توجد منتجات في هذا القسم.</p>
                ) : (
                    products.map(product => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                                <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                                <div>
                                    <p className="font-semibold text-gray-800">{product.name}</p>
                                    <p className="text-sm text-gray-600">{product.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-lg font-medium text-gray-900">{product.price.toFixed(2)} {settings.currency}</span>
                                <button onClick={() => onEdit(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                                    <PencilIcon />
                                </button>
                                <button onClick={() => onDelete(product.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors">
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminProductList;
