import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import CheckoutForm from '../components/CheckoutForm';
import { Customer } from '../types';
import { submitOrder } from '../services/supabaseService';
import { useStoreSettings } from '../hooks/useStoreSettings';

const CartPage: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const { settings } = useStoreSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async (customer: Customer) => {
      setIsSubmitting(true);
      setError(null);
      try {
          await submitOrder(customer, cartItems);
          setOrderSuccess(true);
          clearCart();
      } catch (err) {
          setError('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
          console.error(err);
      } finally {
          setIsSubmitting(false);
      }
  };

  if (orderSuccess) {
      return (
        <div className="container mx-auto p-4 md:p-8">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-lg mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">تم استلام طلبك بنجاح!</h2>
              <p className="text-gray-800">شكراً لك على التسوق معنا. سيتم التواصل معك قريباً لتأكيد تفاصيل الطلب والشحن.</p>
          </div>
        </div>
      );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">سلة التسوق</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-700">سلة التسوق فارغة.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">المنتجات</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t text-left">
              <h3 className="text-2xl font-bold">
                الإجمالي: <span className="text-gray-900">{total.toFixed(2)} {settings.currency}</span>
              </h3>
            </div>
          </div>
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4">معلومات الدفع</h2>
            <CheckoutForm onSubmit={handleCheckout} isSubmitting={isSubmitting}/>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
