import React from 'react';
import { Order } from '../types';
import Modal from './Modal';
import { useStoreSettings } from '../hooks/useStoreSettings';

interface OrderInvoiceModalProps {
    order: Order | null;
    onClose: () => void;
}

const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ order, onClose }) => {
    const { settings } = useStoreSettings();
    if (!order) return null;

    const handlePrint = () => {
        const printableContent = document.getElementById('invoice-content');
        if (printableContent) {
            const printWindow = window.open('', '_blank');
            printWindow?.document.write('<html><head><title>Invoice</title>');
            printWindow?.document.write('<link href="https://cdn.tailwindcss.com" rel="stylesheet">');
            printWindow?.document.write('<style>body { direction: rtl; font-family: "Cairo", sans-serif; }</style>');
            printWindow?.document.write('</head><body>');
            printWindow?.document.write(printableContent.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            setTimeout(() => { 
                printWindow?.focus();
                printWindow?.print();
                printWindow?.close();
            }, 250);
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="p-4" id="invoice-content">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">فاتورة طلب</h2>
                    <p className="text-gray-600">رقم الطلب: #{order.id}</p>
                    <p className="text-gray-600">التاريخ: {new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
                </div>

                <div className="border-b pb-4 mb-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">بيانات العميل</h3>
                    <p><strong>الاسم:</strong> {order.customer.name}</p>
                    <p><strong>البريد الإلكتروني:</strong> {order.customer.email}</p>
                    <p><strong>رقم الهاتف:</strong> {order.customer.phone}</p>
                    {order.customer.alternatePhone && <p><strong>هاتف احتياطي:</strong> {order.customer.alternatePhone}</p>}
                    <p><strong>العنوان:</strong> {order.customer.addressDetails}, {order.customer.city}</p>
                    {order.customer.note && <p><strong>ملاحظة:</strong> {order.customer.note}</p>}
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">المنتجات</h3>
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 pr-2">المنتج</th>
                                <th className="py-2">الكمية</th>
                                <th className="py-2">سعر الوحدة</th>
                                <th className="py-2 pl-2">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.product.id} className="border-b">
                                    <td className="py-2 pr-2 text-gray-800 font-medium">{item.product.name}</td>
                                    <td className="py-2 text-gray-800">{item.quantity}</td>
                                    <td className="py-2 text-gray-800">{item.product.price.toFixed(2)} {settings.currency}</td>
                                    <td className="py-2 pl-2 text-gray-800">{(item.product.price * item.quantity).toFixed(2)} {settings.currency}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 text-left">
                    <h3 className="text-2xl font-bold">
                        الإجمالي الكلي: <span className="text-gray-900">{order.total.toFixed(2)} {settings.currency}</span>
                    </h3>
                </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3 print:hidden">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    إغلاق
                </button>
                <button onClick={handlePrint} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                    طباعة
                </button>
            </div>
        </Modal>
    );
};

export default OrderInvoiceModal;