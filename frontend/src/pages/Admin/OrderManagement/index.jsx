import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, message, Typography, Space } from 'antd';
import orderService from '../../../services/orderService';
import { formatPrice, formatDate } from '../../../utils/format';

const { Title } = Typography;
const { Option } = Select;

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const res = await orderService.getAllOrders();
            if (res && Array.isArray(res.data)) {
                setOrders(res.data);
            }
        } catch (error) {
            message.error("Lỗi tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi Admin đổi trạng thái
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            message.success(`Đã cập nhật trạng thái đơn #${orderId} thành công`);
            // Load lại bảng để thấy thay đổi
            fetchAllOrders();
        } catch (error) {
            message.error("Cập nhật thất bại");
        }
    };

    // Hàm render màu sắc cho badge thanh toán
    const renderPaymentMethod = (method) => {
        if (method === 'COD') return <Tag color="orange">Thanh toán khi nhận hàng (COD)</Tag>;
        if (method === 'BANK') return <Tag color="blue">Chuyển khoản</Tag>;
        return <Tag>{method}</Tag>;
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 60, render: (id) => <b>#{id}</b> },
        { 
            title: 'Khách hàng', 
            dataIndex: 'fullName',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    <small style={{ color: '#888' }}>{record.phoneNumber}</small>
                </div>
            )
        },
        { title: 'Ngày đặt', dataIndex: 'orderDate', render: (date) => formatDate(date) },
        { 
            title: 'Tổng tiền', 
            dataIndex: 'totalMoney', 
            render: (money) => <b style={{ color: 'red' }}>{formatPrice(money)}</b> 
        },
        { 
            title: 'Thanh toán', 
            dataIndex: 'paymentMethod',
            render: (method) => renderPaymentMethod(method)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    defaultValue={status}
                    style={{ width: 160 }} // Tăng độ rộng để vừa chữ tiếng Việt
                    onChange={(value) => handleStatusChange(record.id, value)}
                    // Nếu trạng thái là Hủy thì viền đỏ cảnh báo
                    status={status === 'CANCELLED' ? 'error' : ''} 
                >
                    {/* 👇 ĐÃ SỬA THÀNH TIẾNG VIỆT TẠI ĐÂY */}
                    <Option value="PENDING">Chờ xác nhận</Option>
                    <Option value="SHIPPING">Đang giao hàng</Option>
                    <Option value="DELIVERED">Đã giao hàng</Option>
                    <Option value="CANCELLED">Đã hủy</Option>
                </Select>
            ),
        },
    ];

    return (
        <div>
            <Title level={3}>Quản lý Đơn hàng</Title>
            <Table 
                dataSource={orders} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 8 }}
            />
        </div>
    );
};

export default OrderManagement;