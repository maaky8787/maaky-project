import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useStoreSettings } from '../hooks/useStoreSettings';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { settings } = useStoreSettings();
  const location = useLocation();
  
  const linkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeLinkClasses = "bg-gray-900 text-white";
  const inactiveLinkClasses = "text-gray-700 hover:bg-gray-200";

  const getLinkClass = (path: string) => {
      return location.pathname === path ? `${linkClasses} ${activeLinkClasses}` : `${linkClasses} ${inactiveLinkClasses}`;
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              {settings.storeName}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className={getLinkClass('/')}>
              الرئيسية
            </Link>
            <Link to="/admin" className={getLinkClass('/admin')}>
              لوحة التحكم
            </Link>
            <Link to="/cart" className={`${getLinkClass('/cart')} relative`}>
              <div className="flex items-center">
                <ShoppingCartIcon />
                <span className="mr-2">السلة</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-xs rounded-full h-5 w-5">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
