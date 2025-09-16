import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, ALL_ORDER_STATUSES } from '../types';
import { getOrders, updateOrderStatus, deleteOrder, deleteCompletedOrders } from '../services/supabaseService';
import OrderInvoiceModal from './OrderInvoiceModal';
import EyeIcon from './icons/EyeIcon';
import { useStoreSettings } from '../hooks/useStoreSettings';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { settings } = useStoreSettings();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            setError('فشل في تحميل الطلبات.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        try {
            const updatedOrder = await updateOrderStatus(orderId, newStatus);
            setOrders(prevOrders =>
                prevOrders.map(o => (o.id === orderId ? updatedOrder : o))
            );
        } catch (err) {
            alert('فشل في تحديث حالة الطلب.');
            console.error(err);
        }
    };

    const handleDeleteOrder = async (orderId: number, customerName: string) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف طلب ${customerName} (رقم ${orderId})؟`)) {
            try {
                await deleteOrder(orderId);
                setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
                alert('تم حذف الطلب بنجاح.');
            } catch (err) {
                alert('فشل في حذف الطلب.');
                console.error(err);
            }
        }
    };

    const handleDeleteCompletedOrders = async () => {
        const completedOrders = orders.filter(order => order.status === 'تم التوصيل');
        if (completedOrders.length === 0) {
            alert('لا توجد طلبات مكتملة للحذف.');
            return;
        }

        if (window.confirm(`هل أنت متأكد من رغبتك في حذف جميع الطلبات المكتملة (${completedOrders.length} طلب)؟`)) {
            try {
                await deleteCompletedOrders();
                setOrders(prevOrders => prevOrders.filter(o => o.status !== 'تم التوصيل'));
                alert(`تم حذف ${completedOrders.length} طلب مكتمل بنجاح.`);
            } catch (err) {
                alert('فشل في حذف الطلبات المكتملة.');
                console.error(err);
            }
        }
    };

    if (loading) return <div className="text-center p-8">جاري تحميل الطلبات...</div>;
    if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'قيد المراجعة': return 'bg-yellow-200 text-yellow-800 focus:ring-yellow-500';
            case 'قيد التجهيز': return 'bg-blue-200 text-blue-800 focus:ring-blue-500';
            case 'تم الشحن': return 'bg-indigo-200 text-indigo-800 focus:ring-indigo-500';
            case 'تم التوصيل': return 'bg-green-200 text-green-800 focus:ring-green-500';
            case 'ملغي': return 'bg-red-200 text-red-800 focus:ring-red-500';
            default: return 'bg-gray-200 text-gray-800 focus:ring-gray-500';
        }
    };

    const completedOrdersCount = orders.filter(order => order.status === 'تم التوصيل').length;

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">إدارة الطلبات</h2>
                    <div className="flex gap-3">
                        {completedOrdersCount > 0 && (
                            <button
                                onClick={handleDeleteCompletedOrders}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                            >
                                🗑️ حذف المكتملة ({completedOrdersCount})
                            </button>
                        )}
                        <button
                            onClick={fetchOrders}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    جاري التحديث...
                                </>
                            ) : (
                                <>
                                    🔄 تحديث الطلبات
                                </>
                            )}
                        </button>
                    </div>
                </div>
                
                {orders.length > 0 && (
                    <div className="text-sm text-gray-600">
                        إجمالي الطلبات: {orders.length} | 
                        قيد المراجعة: {orders.filter(o => o.status === 'قيد المراجعة').length} | 
                        مكتملة: {completedOrdersCount}
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-5 rounded-lg shadow-md flex flex-col hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                            <p className="font-bold text-lg text-gray-800">طلب #{order.id}</p>
                            <div className="flex gap-1">
                                <button 
                                    onClick={() => setSelectedOrder(order)} 
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                    title="عرض تفاصيل الطلب"
                                >
                                    <EyeIcon />
                                </button>
                                <button 
                                    onClick={() => handleDeleteOrder(order.id!, order.customer.name)} 
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                                    title="حذف الطلب"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4 text-sm flex-grow">
                            <p><span className="font-semibold text-gray-800">العميل:</span> {order.customer.name}</p>
                            <p><span className="font-semibold text-gray-800">التاريخ:</span> {new Date(order.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p><span className="font-semibold text-gray-800">الإجمالي:</span> <span className="font-bold">{order.total.toFixed(2)} {settings.currency}</span></p>
                        </div>
                        <div className="mt-auto">
                            <label htmlFor={`status-${order.id}`} className="sr-only">حالة الطلب</label>
                            <select
                                id={`status-${order.id}`}
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id!, e.target.value as OrderStatus)}
                                className={`w-full p-2 text-center rounded-md text-sm font-semibold border-0 focus:ring-2 focus:ring-offset-2 transition-colors ${getStatusColor(order.status)}`}
                            >
                                {ALL_ORDER_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            {orders.length === 0 && <p className="text-center text-gray-700 py-8 bg-white rounded-lg shadow-md">لا توجد طلبات حالياً.</p>}

            {selectedOrder && (
                <OrderInvoiceModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

export default AdminOrders;