import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Table, Tag, Button, Spin, Image } from 'antd';
import { ArrowLeftOutlined, ShoppingOutlined, CreditCardOutlined } from '@ant-design/icons';
import orderService from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/format';
// 1. Import CSS
import './OrderDetailPage.css';

const { Title, Text } = Typography;

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const res = await orderService.getOrderById(id);
            setOrder(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="spinner-center"><Spin size="large" /></div>;
    if (!order) return <div className="text-center py-20">Không tìm thấy đơn hàng</div>;

    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            width: '50%',
            render: (_, record) => (
                <div className="product-item-info">
                    <Image 
                        width={60} 
                        src={record.product?.thumbnail || "https://placehold.co/60"} 
                        className="product-thumb"
                    />
                    <div>
                        <div 
                              className="product-name-link cursor-pointer"
                              onClick={() => navigate(`/product/${record.product?.id}`)} 
                        >
                            {record.product?.name}
                        </div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Phân loại: {record.variant?.size} - {record.variant?.color}
                        </Text>
                    </div>
                </div>
            )
        },
        { 
            title: 'Đơn giá', 
            dataIndex: 'price', 
            align: 'right',
            render: (price) => formatPrice(price) 
        },
        { 
            title: 'Số lượng', 
            dataIndex: 'numberOfProducts', 
            align: 'center',
            render: (num) => `x${num}`
        },
        { 
            title: 'Thành tiền', 
            dataIndex: 'totalMoney', 
            align: 'right',
            render: (money) => <Text strong>{formatPrice(money)}</Text>
        }
    ];

    return (
        <div className="order-detail-container py-20">
            <div className="container detail-content-wrapper">
                {/* Header: Nút back & Tiêu đề */}
                <div className="detail-header">
                    <div>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')}>
                            Quay lại
                        </Button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Title level={4} style={{ margin: 0 }}>ĐƠN HÀNG #{order.id}</Title>
                        <Text type="secondary">Đặt ngày: {formatDate(order.orderDate)}</Text>
                    </div>
                </div>

                {/* Card thông tin */}
                <Row gutter={[24, 24]} className="mb-30">
                    <Col xs={24} md={12}>
                        {/* 👇 Đã sửa: dùng variant="borderless" thay cho bordered={false} */}
                        <Card 
                            title={<><ShoppingOutlined /> Thông tin nhận hàng</>} 
                            className="info-card" 
                            variant="borderless"
                        >
                            <div className="info-row">
                                <span className="info-label">Người nhận:</span>
                                <span className="info-value">{order.fullName}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Số điện thoại:</span>
                                <span className="info-value">{order.phoneNumber}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Địa chỉ:</span>
                                <span className="info-value">{order.address}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Ghi chú:</span>
                                <span className="info-value">{order.note || 'Không có'}</span>
                            </div>
                        </Card>
                    </Col>
                    
                    <Col xs={24} md={12}>
                        {/* 👇 Đã sửa: dùng variant="borderless" thay cho bordered={false} */}
                        <Card 
                            title={<><CreditCardOutlined /> Thanh toán & Trạng thái</>} 
                            className="info-card" 
                            variant="borderless"
                        >
                            <div className="info-row">
                                <span className="info-label">Phương thức:</span>
                                <span className="info-value">
                                    <Tag color="blue">{order.paymentMethod}</Tag>
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Trạng thái:</span>
                                <span className="info-value">
                                    <Tag color={order.status === 'PENDING' ? 'orange' : 'green'}>
                                        {order.status}
                                    </Tag>
                                </span>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Bảng sản phẩm */}
                <Table 
                    columns={columns} 
                    dataSource={order.orderDetails} 
                    rowKey="id" 
                    pagination={false} 
                    bordered
                    className="mb-20"
                />

                {/* Tổng tiền */}
                <div className="total-section">
                    <div className="total-wrapper">
                        <div className="total-row">
                            <Text type="secondary">Tổng tiền hàng:</Text>
                            <Text>{formatPrice(order.totalMoney - 30000)}</Text> 
                        </div>
                        <div className="total-row">
                            <Text type="secondary">Phí vận chuyển:</Text>
                            <Text>{formatPrice(30000)}</Text>
                        </div>
                        <div className="total-row" style={{ marginTop: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
                            <Text strong style={{ fontSize: 16 }}>TỔNG CỘNG:</Text>
                            <span className="final-price">{formatPrice(order.totalMoney)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;