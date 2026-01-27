// src/utils/format.js

export const formatPrice = (price) => {
    // Kiểm tra nếu giá trị null/undefined thì trả về 0đ
    if (!price && price !== 0) return '0 ₫';
    
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(price);
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
};