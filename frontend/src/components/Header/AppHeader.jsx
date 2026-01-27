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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Ant Design v5 khuyến khích dùng items thay vì bọc ngoài bằng <Menu>
    const menuItems = [
        { key: '1', label: <Link to="/profile">Thông tin tài khoản</Link>, icon: <UserOutlined /> },
        { key: '2', label: 'Đơn mua', icon: <ShoppingCartOutlined /> },
        { type: 'divider' },
        { key: '3', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout, danger: true },
    ];

    return (
        <Header className="app-header px-20 d-flex align-center justify-between">
            {/* Logo */}
            <div className="logo cursor-pointer" onClick={() => navigate('/')}>
                SneakerStore
            </div>

            {/* Menu giữa */}
            <div className="flex-1 d-flex justify-center" style={{ height: '100%' }}>
                <Menu 
                    className="menu-custom w-100 d-flex justify-center"
                    mode="horizontal" 
                    defaultSelectedKeys={['1']} 
                    items={[
                        { key: '1', label: 'Trang chủ' },
                        { key: '2', label: 'Sản phẩm mới' },
                        { key: '3', label: 'Nam' },
                        { key: '4', label: 'Nữ' },
                        { key: '5', label: 'Khuyến mãi' },
                    ]} 
                />
            </div>

            {/* User Section */}
            <div className="d-flex align-center gap-md" style={{ height: '100%' }}>
                <Badge count={2}>
                    <Button icon={<ShoppingCartOutlined />} shape="circle" size="large" />
                </Badge>

                {user ? (
                    <Dropdown 
                        menu={{ items: menuItems }} 
                        placement="bottomRight" 
                        arrow
                        overlayClassName="user-app-scope"
                        getPopupContainer={(trigger) => trigger.parentElement}
                    >
                        <Space className="d-flex align-center gap-sm cursor-pointer header-user-info">
                            <Avatar style={{ backgroundColor: 'var(--primary-color)' }} icon={<UserOutlined />} />
                            <Text strong>{user.fullName || user.username}</Text>
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