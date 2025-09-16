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
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 object-cover rounded-md" />
        <div>
          <h4 className="font-semibold">{item.product.name}</h4>
          <p className="text-gray-600 text-sm">{item.product.price.toFixed(2)} {settings.currency}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md">
          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-1 text-lg">-</button>
          <span className="px-4 py-1">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1 text-lg">+</button>
        </div>
        <span className="font-semibold w-24 text-center">
          {(item.product.price * item.quantity).toFixed(2)} {settings.currency}
        </span>
        <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
