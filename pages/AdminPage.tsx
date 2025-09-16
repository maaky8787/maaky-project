import React, { useState, useEffect, useMemo } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/supabaseService';
import { Product } from '../types';
import AdminStats from '../components/AdminStats';
import AdminProductList from '../components/AdminProductList';
import AdminOrders from '../components/AdminOrders';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import ChartBarIcon from '../components/icons/ChartBarIcon';
import CubeIcon from '../components/icons/CubeIcon';
import ClipboardListIcon from '../components/icons/ClipboardListIcon';
import AdminSettings from '../components/AdminSettings';
import CogIcon from '../components/icons/CogIcon';

type AdminView = 'stats' | 'products' | 'orders' | 'settings';

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [activeView, setActiveView] = useState<AdminView>('stats');

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const { featuredProducts, regularProducts } = useMemo(() => {
    const featured = products.filter(p => p.is_featured);
    const regular = products.filter(p => !p.is_featured);
    return { featuredProducts: featured, regularProducts: regular };
  }, [products]);

  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  };

  const handleFormSubmit = async (productData: Product) => {
    try {
      if (productData.id === 0) { // New product
        const { id, ...productWithoutId } = productData;
        await addProduct(productWithoutId);
      } else { // Existing product
        await updateProduct(productData);
      }
      handleCloseModal();
      fetchProducts(); // Refresh product list
    } catch (err) {
      alert('حدث خطأ أثناء حفظ المنتج.');
      console.error(err);
    }
  };
  
  const handleDelete = async (productId: number) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟')) {
        try {
            await deleteProduct(productId);
            fetchProducts();
        } catch (err) {
            alert('حدث خطأ أثناء حذف المنتج.');
            console.error(err);
        }
    }
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
  
  const NavButton: React.FC<{ view: AdminView; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => setActiveView(view)}
        className={`flex items-center justify-center flex-1 p-4 text-sm font-medium transition-all duration-300 rounded-lg ${
          isActive ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        {icon}
        <span className="mr-3">{label}</span>
      </button>
    );
  };


  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>

      <div className="flex space-x-4 space-x-reverse bg-gray-200 p-2 rounded-xl shadow-inner">
        <NavButton view="stats" label="الإحصائيات" icon={<ChartBarIcon />} />
        <NavButton view="products" label="المنتجات" icon={<CubeIcon />} />
        <NavButton view="orders" label="الطلبات" icon={<ClipboardListIcon />} />
        <NavButton view="settings" label="الإعدادات" icon={<CogIcon />} />
      </div>

      <div className="mt-8">
        {activeView === 'stats' && <AdminStats products={products} />}
        
        {activeView === 'products' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">إدارة المنتجات</h2>
              <button
                onClick={() => handleOpenModal()}
                className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                إضافة منتج جديد
              </button>
            </div>
            <AdminProductList
              title="المنتجات المميزة"
              products={featuredProducts}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
            <AdminProductList
              title="باقي المنتجات"
              products={regularProducts}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          </div>
        )}

        {activeView === 'orders' && <AdminOrders />}

        {activeView === 'settings' && <AdminSettings />}
      </div>
      
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
            <div className="p-2">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    {selectedProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h3>
                <ProductForm
                    product={selectedProduct}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                />
            </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPage;
