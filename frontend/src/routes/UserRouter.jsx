import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import ProductDetailPage from '../pages/ProductDetail/ProductDetailPage';

const UserRouter = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />

                <Route path="product/:id" element={<ProductDetailPage />} />
                
                {/* Đường dẫn: /cart */}
                <Route path="cart" element={<div>Giỏ hàng (Sẽ làm sau)</div>} />
            </Route>
        </Routes>
    );
};

export default UserRouter;