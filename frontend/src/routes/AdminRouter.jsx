import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Admin/Dashboard';
// import ProductManager from '../pages/Admin/ProductManager';

const AdminRouter = () => {
    return (
        <Routes>
            {/* Lưu ý: Không cần ghi "/admin" ở đây nữa vì AppRouter đã lo rồi */}
            <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                
                {/* Đường dẫn này thực tế sẽ là: /admin/products */}
                <Route path="products" element={<div>Quản lý sản phẩm</div>} />
                
                {/* Đường dẫn này thực tế sẽ là: /admin/orders */}
                <Route path="orders" element={<div>Quản lý đơn hàng</div>} />
            </Route>
        </Routes>
    );
};

export default AdminRouter;