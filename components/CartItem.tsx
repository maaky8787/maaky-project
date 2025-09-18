import React from 'react';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../hooks/useCart';
import { useStoreSettings } from '../hooks/useStoreSettings';
import TrashIcon from './icons/TrashIcon';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { settings } = useStoreSettings();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
        <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm sm:text-base truncate">{item.product.name}</h4>
          <p className="text-gray-600 text-xs sm:text-sm">{item.product.price.toFixed(2)} {settings.currency}</p>
          {item.selectedSize && (
            <p className="text-blue-600 text-xs sm:text-sm font-medium">الحجم: {item.selectedSize}</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between w-full sm:w-auto space-x-2 sm:space-x-4">
        <div className="flex items-center border rounded-md">
          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 sm:px-3 py-1 text-sm sm:text-lg">-</button>
          <span className="px-2 sm:px-4 py-1 text-sm sm:text-base">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 sm:px-3 py-1 text-sm sm:text-lg">+</button>
        </div>
        <span className="font-semibold text-sm sm:text-base w-20 sm:w-24 text-center">
          {(item.product.price * item.quantity).toFixed(2)} {settings.currency}
        </span>
        <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700 p-1">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
