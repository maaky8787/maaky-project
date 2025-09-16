import React, { useState } from 'react';
import { Product } from '../types';
import { useStoreSettings } from '../hooks/useStoreSettings';

interface AdminStatsProps {
    products: Product[];
}

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
    <div className="bg-white p-4 rounded-lg text-center shadow-md">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
);

const EditForm = ({ storeInfo, onSave, onCancel, onChange }) => (
    <form onSubmit={onSave} className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">تعديل بيانات المتجر</h3>
        {[
            { key: 'address', label: 'العنوان', type: 'text' },
            { key: 'phone', label: 'الهاتف', type: 'tel' },
            { key: 'email', label: 'البريد الإلكتروني', type: 'email' }
        ].map(({ key, label, type }) => (
            <div key={key} className="mb-4">
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                    type={type}
                    value={storeInfo[key]}
                    onChange={(e) => onChange(key, e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
        ))}
        <div className="flex gap-2 justify-end">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                إلغاء
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                حفظ
            </button>
        </div>
    </form>
);

const AdminStats = ({ products }: AdminStatsProps) => {
    const { settings, updateStoreSettings } = useStoreSettings();
    const [isEditing, setIsEditing] = useState(false);
    const [storeInfo, setStoreInfo] = useState({
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || ''
    });

    const stats = {
        totalProducts: products.length,
        featuredProducts: products.filter(p => p.is_featured).length,
        categories: new Set(products.map(p => p.category)).size,
        averagePrice: products.length ? 
            (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : 
            '0'
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateStoreSettings(storeInfo);
        setIsEditing(false);
    };

    const handleChange = (key: string, value: string) => {
        setStoreInfo(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">نظرة عامة</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="إجمالي المنتجات" value={stats.totalProducts} />
                <StatCard title="المنتجات المميزة" value={stats.featuredProducts} />
                <StatCard title="عدد الفئات" value={stats.categories} />
                <StatCard title="متوسط السعر" value={`${stats.averagePrice} ${settings.currency}`} />
            </div>

            <footer className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <p>{settings.address}</p>
                        <p>هاتف: {settings.phone}</p>
                        <p>البريد: {settings.email}</p>
                    </div>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                        تعديل
                    </button>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <EditForm
                            storeInfo={storeInfo}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                            onChange={handleChange}
                        />
                    </div>
                )}
            </footer>
        </div>
    );
};

export default AdminStats;
