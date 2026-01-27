import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Admin/Dashboard';
import ProductManager from '../pages/Admin/ProductManager';


const AdminRouter = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                
                {/* Đường dẫn này thực tế sẽ là: /admin/products */}
                <Route path="products" element={<ProductManager />} />
                
                {/* Đường dẫn này thực tế sẽ là: /admin/orders */}
                <Route path="orders" element={<div>Quản lý đơn hàng</div>} />

                {/* Đường dẫn này thực tế sẽ là: /admin/users */}
                <Route path="users" element={<div>Quản lý người dùng</div>} />
            </Route>
        </Routes>
    );
};

export default AdminRouter;