import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
// import ProductDetail from '../pages/ProductDetail';

const UserRouter = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                
                {/* Đường dẫn: /products/:id */}
                <Route path="products/:id" element={<div>Chi tiết sản phẩm</div>} />
                
                {/* Đường dẫn: /cart */}
                <Route path="cart" element={<div>Giỏ hàng</div>} />
            </Route>
        </Routes>
    );
};

export default UserRouter;