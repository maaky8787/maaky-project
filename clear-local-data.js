// ملف لحذف البيانات المحفوظة محلياً
// قم بنسخ هذا الكود وتشغيله في وحدة تحكم المتصفح (F12 > Console)

console.log('🗑️ بدء عملية حذف البيانات المحلية...');

// عرض البيانات الموجودة قبل الحذف
console.log('📋 البيانات المحلية الموجودة:');
if (localStorage.length === 0) {
    console.log('لا توجد بيانات محلية محفوظة');
} else {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`🔑 ${key}:`);
        console.log(value);
        console.log('---');
    }
}

// حذف جميع البيانات المحلية
localStorage.clear();

// تأكيد الحذف
console.log('✅ تم حذف جميع البيانات المحلية بنجاح!');
console.log('📊 عدد العناصر المتبقية في localStorage:', localStorage.length);

// إعادة تحميل الصفحة لتطبيق التغييرات
console.log('🔄 سيتم إعادة تحميل الصفحة خلال 3 ثوانٍ...');
setTimeout(() => {
    window.location.reload();
}, 3000);