import React from 'react';
import { Customer } from '../types';

interface CheckoutFormProps {
    onSubmit: (customer: Customer) => void;
    isSubmitting: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, isSubmitting }) => {
  const [customer, setCustomer] = React.useState<Customer>({ name: '', email: '', phone: '', alternatePhone: '', city: '', addressDetails: '', note: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(customer);
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 bg-gray-50 text-gray-900 placeholder:text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">الاسم الكامل</label>
        <input type="text" id="name" name="name" value={customer.name} onChange={handleChange} required className={inputClasses} placeholder="مثال: محمد أحمد"/>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">البريد الإلكتروني</label>
        <input type="email" id="email" name="email" value={customer.email} onChange={handleChange} required className={inputClasses} placeholder="example@email.com"/>
      </div>
       <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">رقم الهاتف</label>
        <input type="tel" id="phone" name="phone" value={customer.phone} onChange={handleChange} required className={inputClasses} placeholder="مثال: 0501234567"/>
      </div>
       <div>
        <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-800 mb-1">رقم هاتف احتياطي (اختياري)</label>
        <input type="tel" id="alternatePhone" name="alternatePhone" value={customer.alternatePhone} onChange={handleChange} className={inputClasses} />
      </div>
       <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-800 mb-1">المدينة</label>
        <input type="text" id="city" name="city" value={customer.city} onChange={handleChange} required className={inputClasses} placeholder="مثال: دبي"/>
      </div>
      <div>
        <label htmlFor="addressDetails" className="block text-sm font-medium text-gray-800 mb-1">وصف دقيق للعنوان</label>
        <textarea id="addressDetails" name="addressDetails" value={customer.addressDetails} onChange={handleChange} required rows={3} className={`${inputClasses} resize-none`} placeholder="اسم الشارع، رقم المبنى، رقم الشقة..."></textarea>
      </div>
        <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-800 mb-1">ملاحظة (اختياري)</label>
        <textarea id="note" name="note" value={customer.note} onChange={handleChange} rows={2} className={`${inputClasses} resize-none`} placeholder="أي تعليمات خاصة بالتوصيل..."></textarea>
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
      >
        {isSubmitting ? (
             <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
        ) : (
            'إتمام الطلب'
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;