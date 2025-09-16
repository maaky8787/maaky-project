export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
    name: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    city: string;
    addressDetails: string;
    note?: string;
}

export type OrderStatus = 'قيد المراجعة' | 'قيد التجهيز' | 'تم الشحن' | 'تم التوصيل' | 'ملغي';

export const ALL_ORDER_STATUSES: OrderStatus[] = ['قيد المراجعة', 'قيد التجهيز', 'تم الشحن', 'تم التوصيل', 'ملغي'];

export interface Order {
  id?: number;
  customer: Customer;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  created_at: string; // ISO date string
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  currency: string;
}