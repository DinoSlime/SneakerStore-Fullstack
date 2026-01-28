import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Typography, Space, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatDate } from '../../utils/format'; 
import './OrderHistoryPage.css';

const { Title } = Typography;

const OrderHistoryPage = () => {
    // 1. Khởi tạo state là mảng rỗng []
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderService.getOrdersByUser(user.id);
            
            // 2. Kiểm tra dữ liệu trả về CÓ PHẢI LÀ MẢNG KHÔNG?
            // Nếu là mảng -> set dữ liệu
            // Nếu không phải (null, undefined, error msg...) -> set mảng rỗng để tránh crash
            if (res && Array.isArray(res.data)) {
                setOrders(res.data);
            } else {
                console.warn("API không trả về mảng danh sách:", res);
                setOrders([]);
            }

        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
            setOrders([]); // Gặp lỗi thì set rỗng luôn
        } finally {
            setLoading(false);
        }
    };

    // Hàm render màu sắc cho trạng thái
    const renderStatus = (status) => {
        switch (status) {
            case 'PENDING': return <Tag color="orange">Chờ xác nhận</Tag>;
            case 'SHIPPING': return <Tag color="blue">Đang giao</Tag>;
            case 'DELIVERED': return <Tag color="green">Đã giao</Tag>;
            case 'CANCELLED': return <Tag color="red">Đã hủy</Tag>;
            default: return <Tag>{status}</Tag>;
        }
    };

    const columns = [
        { title: 'Mã đơn', dataIndex: 'id', key: 'id', render: (id) => <b>#{id}</b> },
        { 
            title: 'Ngày đặt', 
            dataIndex: 'orderDate', 
            key: 'orderDate',
            render: (date) => formatDate(date) 
        },
        { 
            title: 'Tổng tiền', 
            dataIndex: 'totalMoney', 
            key: 'totalMoney', 
            render: (price) => <span style={{ color: 'red', fontWeight: 'bold' }}>{formatPrice(price)}</span> 
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status', 
            render: (status) => renderStatus(status) 
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button 
                    type="primary" 
                    ghost 
                    size="small" 
                    icon={<EyeOutlined />} 
                    className="btn-view-detail" // 👈 NHỚ THÊM DÒNG NÀY
                    onClick={() => navigate(`/order/${record.id}`)} 
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div className="container py-20">
            <Title level={2} style={{ marginBottom: 20 }}>Lịch sử đơn hàng</Title>
            {loading ? (
                <div style={{ textAlign: 'center', margin: '50px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Table 
                    columns={columns} 
                    dataSource={orders} 
                    rowKey="id" 
                    pagination={{ pageSize: 5 }} 
                    locale={{ emptyText: 'Bạn chưa có đơn hàng nào' }} // Thông báo khi bảng rỗng
                />
            )}
        </div>
    );
};

export default OrderHistoryPage;