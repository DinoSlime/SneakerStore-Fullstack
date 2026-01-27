import React, { createContext, useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Khôi phục phiên đăng nhập khi F5 trang
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            
            if (storedUser && token) {
                setUser(JSON.parse(storedUser)); 
            }
        } catch (error) {
            // Nếu dữ liệu rác hoặc lỗi JSON -> Xóa sạch để tránh trắng trang
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
        }
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        message.success('Đã đăng xuất');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);