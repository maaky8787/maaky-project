import React from 'react';
import { useStoreSettings } from '../hooks/useStoreSettings';

const Footer: React.FC = () => {
  const { settings } = useStoreSettings();

  return (
    <footer className="bg-gray-800 text-white p-6 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold mb-2">معلومات المتجر</h3>
          <p>{settings.address}</p>
          <p>هاتف: {settings.phone}</p>
          <p>البريد الإلكتروني: {settings.email}</p>
          {settings.workHours && <p>ساعات العمل: {settings.workHours}</p>}
        </div>
        <div>
          <h3 className="font-bold mb-2">تابعنا على</h3>
          <div className="flex space-x-4">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                فيسبوك
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                انستغرام
              </a>
            )}
            {settings.twitter && (
              <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline">
                تويتر
              </a>
            )}
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                واتساب
              </a>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">حقوق النشر</h3>
          <p>© {new Date().getFullYear()} متجر ماكي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;