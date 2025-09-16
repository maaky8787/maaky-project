import React, { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { useStoreSettings } from './hooks/useStoreSettings';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';


const AppContent: React.FC = () => {
    const { settings, loading } = useStoreSettings();
    
    useEffect(() => {
        if (!loading) {
            document.title = settings.storeName;
        }
    }, [settings.storeName, loading]);

// إضافة اختبار الاتصال مع Supabase
useEffect(() => {
  const testConnection = async () => {
      try {
          const { testSupabaseConnection } = await import('./services/supabaseService');
          const isConnected = await testSupabaseConnection();
          if (isConnected) {
              console.log('✅ Supabase connected successfully!');
          } else {
              console.log('⚠️ Using mock data - Supabase not connected');
          }
      } catch (error) {
          console.log('⚠️ Using mock data - Supabase connection failed');
      }
  };
  
  testConnection();
}, []);

    if (loading) {
        return (
             <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-800"></div>
            </div>
        )
    }
    
    return (
        <div className="bg-gray-100 min-h-screen text-gray-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
    );
}

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <CartProvider>
        <HashRouter>
            <AppContent />
        </HashRouter>
      </CartProvider>
    </SettingsProvider>
  );
};

export default App;
