import React, { useState, useEffect } from 'react';
import { useStoreSettings } from '../hooks/useStoreSettings';
import { StoreSettings } from '../types';
import { testSupabaseConnection, diagnoseEnvironmentVariables, seedSupabaseData } from '../services/supabaseService';

const AdminSettings: React.FC = () => {
    const { settings, saveSettings } = useStoreSettings();
    const [formData, setFormData] = useState<StoreSettings>(settings);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showClearSuccess, setShowClearSuccess] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [seedStatus, setSeedStatus] = useState<'idle' | 'seeding' | 'success' | 'error'>('idle');

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveSettings(formData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    };

    const handleClearLocalData = () => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف البيانات المحفوظة محلياً (بما فيها الإعدادات)؟')) {
            try {
                localStorage.clear();
                setShowClearSuccess(true);
                setTimeout(() => setShowClearSuccess(false), 3000);
                window.location.reload();
            } catch (error) {
                console.error('Failed to clear localStorage', error);
            }
        }
    };

    const handleTestConnection = async () => {
        setConnectionStatus('testing');
        try {
            diagnoseEnvironmentVariables();
            const isConnected = await testSupabaseConnection();
            setConnectionStatus(isConnected ? 'success' : 'error');
            setTimeout(() => setConnectionStatus('idle'), 5000);
        } catch (error) {
            console.error('Connection test failed:', error);
            setConnectionStatus('error');
            setTimeout(() => setConnectionStatus('idle'), 5000);
        }
    };

    const handleSeedData = async () => {
        if (!window.confirm('هل تريد إنشاء منتجات تجريبية في قاعدة البيانات؟ سيتم حذف المنتجات الموجودة.')) {
            return;
        }
        
        setSeedStatus('seeding');
        try {
            await seedSupabaseData();
            setSeedStatus('success');
            setTimeout(() => setSeedStatus('idle'), 5000);
            // إعادة تحميل الصفحة لعرض المنتجات الجديدة
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error('Seed data failed:', error);
            setSeedStatus('error');
            setTimeout(() => setSeedStatus('idle'), 5000);
        }
    };

    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 bg-gray-50 text-gray-900 placeholder:text-gray-500";

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">إعدادات المتجر</h2>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-800 mb-1">اسم المتجر</label>
                    <input type="text" id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} required className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-800 mb-1">البريد الإلكتروني للتواصل</label>
                    <input type="email" id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-800 mb-1">العملة الافتراضية</label>
                    <input type="text" id="currency" name="currency" value={formData.currency} onChange={handleChange} required className={inputClasses} placeholder="مثال: جنيه, ريال, دولار" />
                </div>
                <div className="flex items-center space-x-4 pt-2">
                    <button type="submit" className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                        حفظ الإعدادات
                    </button>
                    {showSuccess && (
                        <p className="text-green-600 text-sm font-medium">تم حفظ الإعدادات بنجاح!</p>
                    )}
                </div>
            </form>

            <hr className="my-6" />

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">البيانات المحلية</h3>
                <p className="text-sm text-gray-600">يمكنك حذف جميع البيانات المحفوظة محلياً على هذا المتصفح (مثل الإعدادات). سيؤدي ذلك إلى إعادة التهيئة.</p>
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={handleClearLocalData}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        حذف البيانات المحلية
                    </button>
                    {showClearSuccess && (
                        <p className="text-green-600 text-sm font-medium">تم حذف البيانات المحلية بنجاح!</p>
                    )}
                </div>
            </div>

            <hr className="my-6" />

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">اختبار الاتصال بقاعدة البيانات</h3>
                <p className="text-sm text-gray-600">اختبر الاتصال بـ Supabase للتأكد من أن المنتجات ستُحفظ في قاعدة البيانات.</p>
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={connectionStatus === 'testing'}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {connectionStatus === 'testing' ? 'جاري الاختبار...' : 'اختبار الاتصال'}
                    </button>
                    {connectionStatus === 'success' && (
                        <p className="text-green-600 text-sm font-medium">✅ الاتصال ناجح! المنتجات ستُحفظ في Supabase</p>
                    )}
                    {connectionStatus === 'error' && (
                        <p className="text-red-600 text-sm font-medium">❌ فشل الاتصال! المنتجات ستُحفظ محلياً فقط</p>
                    )}
                </div>
                <p className="text-xs text-gray-500">تحقق من وحدة تحكم المتصفح (F12) لمزيد من التفاصيل</p>
            </div>

            <hr className="my-6" />

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">إنشاء بيانات تجريبية</h3>
                <p className="text-sm text-gray-600">إنشاء منتجات تجريبية في قاعدة البيانات للاختبار. سيتم حذف المنتجات الموجودة واستبدالها بمنتجات تجريبية.</p>
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={handleSeedData}
                        disabled={seedStatus === 'seeding'}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        {seedStatus === 'seeding' ? 'جاري الإنشاء...' : 'إنشاء بيانات تجريبية'}
                    </button>
                    {seedStatus === 'success' && (
                        <p className="text-green-600 text-sm font-medium">✅ تم إنشاء البيانات التجريبية بنجاح!</p>
                    )}
                    {seedStatus === 'error' && (
                        <p className="text-red-600 text-sm font-medium">❌ فشل في إنشاء البيانات التجريبية!</p>
                    )}
                </div>
                <p className="text-xs text-gray-500">⚠️ تحذير: سيتم حذف جميع المنتجات الموجودة</p>
            </div>
        </div>
    );
};

export default AdminSettings;
