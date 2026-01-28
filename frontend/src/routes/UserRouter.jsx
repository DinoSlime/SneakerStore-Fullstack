import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import ProductDetailPage from '../pages/ProductDetail/ProductDetailPage';
import CartPage from '../pages/CartPage/CartPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
const UserRouter = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />

                <Route path="product/:id" element={<ProductDetailPage />} />
                
                <Route path="/checkout" element={<CheckoutPage />} />
               <Route path="/cart" element={<CartPage />} />
            </Route>
        </Routes>
    );
};

export default UserRouter;