import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useStoreSettings } from '../hooks/useStoreSettings';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { settings } = useStoreSettings();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const linkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeLinkClasses = "bg-gray-900 text-white";
  const inactiveLinkClasses = "text-gray-700 hover:bg-gray-200";

  const getLinkClass = (path: string) => {
      return location.pathname === path ? `${linkClasses} ${activeLinkClasses}` : `${linkClasses} ${inactiveLinkClasses}`;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* الشعار */}
          <div className="flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-900">
              {settings.storeName}
            </Link>
          </div>

          {/* قائمة سطح المكتب */}
          <div className="hidden md:flex items-center space-x-4">
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

          {/* قائمة الهاتف المحمول */}
          <div className="md:hidden flex items-center space-x-2">
            {/* سلة التسوق للهاتف */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-gray-900">
              <ShoppingCartIcon />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-xs rounded-full h-4 w-4">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {/* زر القائمة */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-label="فتح القائمة"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* القائمة المنسدلة للهاتف */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                to="/admin"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/admin' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                لوحة التحكم
              </Link>
              <Link
                to="/cart"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/cart' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                السلة {itemCount > 0 && `(${itemCount})`}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
