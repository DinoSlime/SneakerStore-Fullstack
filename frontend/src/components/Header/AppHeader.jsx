import React from 'react';
import { Layout, Menu, Button, Badge, Dropdown, Avatar, Typography, Space } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AppHeader.css';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // --- 1. Xử lý Đăng xuất ---
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // --- 2. Xử lý Menu Chính (Điều hướng) ---
    const handleMenuClick = (e) => {
        switch (e.key) {
            case 'home':
                navigate('/');
                break;
            case 'products':
                // navigate('/products'); // Mở comment khi bạn làm trang danh sách
                break;
            case 'men':
                // navigate('/category/men');
                break;
            // ... xử lý các case khác
            default:
                break;
        }
    };

    // Danh sách mục Menu chính
    const mainMenuItems = [
        { key: 'home', label: 'Trang chủ' },
        { key: 'products', label: 'Sản phẩm mới' },
        { key: 'men', label: 'Nam' },
        { key: 'women', label: 'Nữ' },
        { key: 'sale', label: 'Khuyến mãi' },
    ];

    // Danh sách mục Dropdown User
    const userMenuItems = [
        { key: 'profile', label: <Link to="/profile">Thông tin tài khoản</Link>, icon: <UserOutlined /> },
        { key: 'orders', label: 'Đơn mua', icon: <ShoppingCartOutlined /> },
        { type: 'divider' },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout, danger: true },
    ];

    return (
        <Header className="app-header px-20 d-flex align-center justify-between">
            {/* --- Logo: Bấm vào về trang chủ --- */}
            <div className="logo cursor-pointer" onClick={() => navigate('/')}>
                SneakerStore
            </div>

            {/* --- Menu Giữa --- */}
            <div className="flex-1 d-flex justify-center" style={{ height: '100%' }}>
                <Menu 
                    className="menu-custom w-100 d-flex justify-center"
                    mode="horizontal" 
                    defaultSelectedKeys={['home']} 
                    items={mainMenuItems} 
                    onClick={handleMenuClick} // <--- Gắn hàm xử lý vào đây
                    disabledOverflow // Ngăn menu bị co lại thành dấu "..."
                />
            </div>

            {/* --- Khu vực User & Giỏ hàng --- */}
            <div className="d-flex align-center gap-md" style={{ height: '100%' }}>
                <Badge count={2} onClick={() => navigate('/cart')} className="cursor-pointer">
                    <Button icon={<ShoppingCartOutlined />} shape="circle" size="large" />
                </Badge>

                {user ? (
                    <Dropdown 
                        menu={{ items: userMenuItems }} 
                        placement="bottomRight" 
                        arrow
                        rootClassName="user-app-scope" // Dùng rootClassName thay vì overlayClassName cho Antd mới
                        getPopupContainer={(trigger) => trigger.parentElement}
                    >
                        <Space className="d-flex align-center gap-sm cursor-pointer header-user-info">
                            <Avatar style={{ backgroundColor: 'var(--primary-color)' }} icon={<UserOutlined />} />
                            {/* Thêm style màu trắng cho tên user để nổi trên nền đen */}
                            <Text strong style={{ color: '#fff' }}>
                                {user.fullName || user.username}
                            </Text>
                        </Space>
                    </Dropdown>
                ) : (
                    <Space className="d-flex gap-sm">
                        <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
                        <Button type="primary" onClick={() => navigate('/register')}>Đăng ký</Button>
                    </Space>
                )}
            </div>
        </Header>
    );
};

export default AppHeader;