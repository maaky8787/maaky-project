import { createClient } from '@supabase/supabase-js';
import { Product, Customer, CartItem, Order, OrderStatus } from '../types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

// استخدام قيم افتراضية إذا لم تكن متوفرة
const defaultUrl = 'https://your-project.supabase.co';
const defaultKey = 'your-anon-key';

const supabase = createClient(
  supabaseUrl || defaultUrl, 
  supabaseAnonKey || defaultKey
);

// بيانات تجريبية للعمل بدون Supabase
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'قميص رجالي أنيق',
    description: 'قميص قطني عالي الجودة بتصميم عصري وأنيق',
    price: 150,
    category: 'قمصان',
    image_url: 'https://images.unsplash.com/photo-1594938298605-cd64d190e6bc?w=400&h=400&fit=crop',
    is_featured: true,
    available_sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 2,
    name: 'بنطلون جينز كلاسيكي',
    description: 'بنطلون جينز أزرق بتصميم كلاسيكي ومريح',
    price: 200,
    category: 'بناطيل',
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    is_featured: true,
    available_sizes: ['28', '30', '32', '34', '36', '38'],
  },
  {
    id: 3,
    name: 'حذاء رياضي مريح',
    description: 'حذاء رياضي عالي الجودة للمشي والرياضة',
    price: 300,
    category: 'أحذية',
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    is_featured: false,
    available_sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
  },
  {
    id: 4,
    name: 'جاكيت شتوي دافئ',
    description: 'جاكيت شتوي أنيق ومريح للطقس البارد',
    price: 400,
    category: 'جاكيتات',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    is_featured: false,
    available_sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  },
  {
    id: 5,
    name: 'قميص بولو أنيق',
    description: 'قميص بولو قطني بتصميم أنيق ومريح',
    price: 180,
    category: 'قمصان',
    image_url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop',
    is_featured: false,
    available_sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 6,
    name: 'بنطلون رسمي',
    description: 'بنطلون رسمي أنيق للمناسبات الخاصة',
    price: 250,
    category: 'بناطيل',
    image_url: 'https://images.unsplash.com/photo-1506629905607-9b4a4b4b4b4b?w=400&h=400&fit=crop',
    is_featured: true,
    available_sizes: ['28', '30', '32', '34', '36'],
  },
];

/**
 * Products - fetch all products from Supabase only
 */
export const getProducts = async (): Promise<Product[]> => {
  // إذا لم تكن متغيرات البيئة محددة، استخدم البيانات التجريبية
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || 
      !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    console.log('🔧 استخدام البيانات التجريبية - لم يتم إعداد Supabase');
    return mockProducts;
  }

  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('❌ خطأ في جلب المنتجات من Supabase:', error);
      console.log('🔧 العودة للبيانات التجريبية');
      return mockProducts;
    }
    return (data ?? []) as Product[];
  } catch (err) {
    console.error('❌ خطأ في الاتصال بـ Supabase:', err);
    console.log('🔧 العودة للبيانات التجريبية');
    return mockProducts;
  }
};

/**
 * Products - add a new product to Supabase only
 * Accepts all fields except id which is auto-generated (or server-side assigned).
 */
export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  // إذا لم تكن متغيرات البيئة محددة، استخدم البيانات التجريبية
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || 
      !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    console.log('🔧 إضافة منتج للبيانات التجريبية');
    const newProduct: Product = {
      ...productData,
      id: mockProducts.length + 1
    };
    mockProducts.push(newProduct);
    return newProduct;
  }

  try {
    const { data, error } = await supabase.from('products').insert(productData).select('*').single();
    if (error) {
      console.error('❌ خطأ في Supabase عند إضافة المنتج:', error);
      throw error;
    }
    return data as Product;
  } catch (err) {
    console.error('❌ خطأ في الاتصال بـ Supabase:', err);
    throw err;
  }
};

/**
 * Products - update a product in Supabase only
 * Updates all fields except id.
 */
export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
  // إذا لم تكن متغيرات البيئة محددة، استخدم البيانات التجريبية
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || 
      !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    console.log('🔧 تحديث منتج في البيانات التجريبية');
    const index = mockProducts.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      mockProducts[index] = updatedProduct;
      return updatedProduct;
    }
    throw new Error('المنتج غير موجود');
  }

  try {
    const { id, ...updates } = updatedProduct as any;

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('❌ خطأ في تحديث المنتج في Supabase:', error);
      throw error;
    }
    return data as Product;
  } catch (err) {
    console.error('❌ خطأ في الاتصال بـ Supabase:', err);
    throw err;
  }
};

/**
 * Products - delete a product in Supabase only
 */
export const deleteProduct = async (productId: number): Promise<{ success: true }> => {
  // إذا لم تكن متغيرات البيئة محددة، استخدم البيانات التجريبية
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || 
      !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    console.log('🔧 حذف منتج من البيانات التجريبية');
    const index = mockProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
      mockProducts.splice(index, 1);
      return { success: true };
    }
    throw new Error('المنتج غير موجود');
  }

  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('❌ خطأ في حذف المنتج من Supabase:', error);
      throw error;
    }
    return { success: true };
  } catch (err) {
    console.error('❌ خطأ في الاتصال بـ Supabase:', err);
    throw err;
  }
};

/**
 * Orders - submit a new order to Supabase only
 */
export const submitOrder = async (customer: Customer, cart: CartItem[]): Promise<{ success: true }> => {
  // إذا لم تكن متغيرات البيئة محددة، استخدم البيانات التجريبية
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || 
      !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    console.log('🔧 حفظ الطلب في البيانات التجريبية');
    // في الوضع التجريبي، نحفظ الطلب في localStorage
    const orderData: Order = {
      id: Date.now(),
      customer,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: 'قيد المراجعة' as OrderStatus,
      created_at: new Date().toISOString(),
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('mockOrders', JSON.stringify(existingOrders));
    return { success: true };
  }

  try {
    const orderData: Omit<Order, 'id'> = {
      customer,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: 'قيد المراجعة' as OrderStatus,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('orders').insert(orderData);
    if (error) {
      console.error('❌ خطأ في إرسال الطلب إلى Supabase:', error);
      throw error;
    }
    return { success: true };
  } catch (err) {
    console.error('❌ خطأ في الاتصال بـ Supabase:', err);
    throw err;
  }
};

/**
 * Orders - fetch all orders from Supabase only
 */
export const getOrders = async (): Promise<Order[]> => {
  // إذا لم تكن متغيرات البيئة محددة، استخدم البيانات التجريبية
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || 
      !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    console.log('🔧 جلب الطلبات من البيانات التجريبية');
    const orders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    return orders.sort((a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ خطأ في جلب الطلبات من Supabase:', error);
      throw error;
    }
    return (data ?? []) as Order[];
  } catch (err) {
    console.error('❌ خطأ في الاتصال بـ Supabase:', err);
    throw err;
  }
};

/**
 * Orders - update order status in Supabase only
 */
export const updateOrderStatus = async (orderId: number, status: OrderStatus): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select('*')
    .single();

  if (error) {
    console.error('❌ خطأ في تحديث الطلب في Supabase:', error);
    throw error;
  }
  return data as Order;
};

/**
 * Orders - delete a single order in Supabase only
 */
export const deleteOrder = async (orderId: number): Promise<{ success: true }> => {
  const { error } = await supabase.from('orders').delete().eq('id', orderId);
  if (error) {
    console.error('❌ خطأ في حذف الطلب من Supabase:', error);
    throw error;
  }
  return { success: true };
};

/**
 * Orders - delete all completed (تم التوصيل) orders in Supabase only
 */
export const deleteCompletedOrders = async (): Promise<{ success: true }> => {
  const { error } = await supabase.from('orders').delete().eq('status', 'تم التوصيل');
  if (error) {
    console.error('❌ خطأ في حذف الطلبات المكتملة من Supabase:', error);
    throw error;
  }
  return { success: true };
};

/**
 * Test Supabase connectivity without fetching data payload
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  // إذا لم تكن متغيرات البيئة محددة، استخدم البيانات التجريبية
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || 
      !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    console.log('🔧 استخدام البيانات التجريبية - لا حاجة لاختبار Supabase');
    return true;
  }

  try {
    const { error } = await supabase.from('products').select('*', { head: true, count: 'estimated' });
    if (error) {
      console.error('❌ فشل اختبار الاتصال بـ Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('❌ حدث خطأ أثناء اختبار الاتصال بـ Supabase:', err);
    return false;
  }
};

/**
 * Diagnose environment variables (development use only)
 */
export const diagnoseEnvironmentVariables = () => {
  console.log('🔍 تشخيص متغيرات البيئة...');
  console.log('VITE_SUPABASE_URL:', (import.meta as any).env?.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY:', (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ? 'موجود' : 'غير موجود');
};

/**
 * Delete all products from Supabase (development helper)
 */
export const clearAllProducts = async (): Promise<{ success: true }> => {
  try {
    const { error } = await supabase.from('products').delete().neq('id', 0);
    if (error) {
      console.error('❌ فشل في حذف المنتجات:', error);
      throw error;
    }
    console.log('✅ تم حذف جميع المنتجات بنجاح');
    return { success: true };
  } catch (err) {
    console.error('❌ خطأ في حذف المنتجات:', err);
    throw err;
  }
};

/**
 * Seed demo products directly into Supabase (development helper)
 */
export const seedSupabaseData = async (): Promise<Product[]> => {
  const mockProducts: Omit<Product, 'id'>[] = [
    {
      name: 'قميص رجالي أنيق',
      description: 'قميص قطني عالي الجودة بتصميم عصري وأنيق',
      price: 150,
      category: 'قمصان',
      image_url: 'https://images.unsplash.com/photo-1594938298605-cd64d190e6bc?w=400&h=400&fit=crop',
      is_featured: true,
    },
    {
      name: 'بنطلون جينز كلاسيكي',
      description: 'بنطلون جينز أزرق بتصميم كلاسيكي ومريح',
      price: 200,
      category: 'بناطيل',
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      is_featured: true,
    },
    {
      name: 'حذاء رياضي مريح',
      description: 'حذاء رياضي عالي الجودة للمشي والرياضة',
      price: 300,
      category: 'أحذية',
      image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      is_featured: false,
    },
    {
      name: 'جاكيت شتوي دافئ',
      description: 'جاكيت شتوي أنيق ومريح للطقس البارد',
      price: 400,
      category: 'جاكيتات',
      image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      is_featured: false,
    },
    {
      name: 'قميص بولو أنيق',
      description: 'قميص بولو قطني بتصميم أنيق ومريح',
      price: 180,
      category: 'قمصان',
      image_url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop',
      is_featured: false,
    },
    {
      name: 'بنطلون رسمي',
      description: 'بنطلون رسمي أنيق للمناسبات الخاصة',
      price: 250,
      category: 'بناطيل',
      image_url: 'https://images.unsplash.com/photo-1506629905607-9b4a4b4b4b4b?w=400&h=400&fit=crop',
      is_featured: true,
    },
  ];

  // delete all current rows (development convenience)
  await supabase.from('products').delete().neq('id', 0);

  const { data, error } = await supabase.from('products').insert(mockProducts).select('*');
  if (error) {
    console.error('❌ فشل في إنشاء البيانات التجريبية:', error);
    throw error;
  }
  return (data ?? []) as Product[];
};