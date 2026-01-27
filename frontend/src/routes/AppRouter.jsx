import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminRouter from './AdminRouter';
import UserRouter from './UserRouter.jsx';

const AppRouter = () => {
    return (
        <Routes>
            {/* 1. KHU VỰC ADMIN */}
            {/* Nếu đường dẫn bắt đầu bằng /admin/... thì giao cho AdminRouter xử lý */}
           
            <Route path="/admin/*" element={<AdminRouter />} />

            {/* 2. KHU VỰC USER */}
            {/* Tất cả các đường dẫn còn lại giao cho UserRouter */}
            <Route path="/*" element={<UserRouter />} />
        </Routes>
    );
};

export default AppRouter;