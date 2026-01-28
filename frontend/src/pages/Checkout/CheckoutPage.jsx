import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Button, Radio, Typography, Card, Divider, message, Spin, Empty } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
// 👇 Đã mở import orderService (Nhớ tạo file service này nhé)
import orderService from '../../services/orderService'; 

import './CheckoutPage.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Lấy dữ liệu từ Context
    const { cartItems, clearCart } = useContext(CartContext);
    const { user } = useAuth(); // Lấy thông tin user đã đăng nhập

    // Tính tổng tiền
    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 30000; 
    const finalTotal = subTotal + shippingFee;

    // Tự động điền thông tin nếu user đã đăng nhập
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName || user.username,
                phone: user.phone || '', 
                address: user.address || ''
            });
        }
    }, [user, form]);

    // Nếu giỏ hàng rỗng thì đá về trang cart
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    // Xử lý khi bấm Đặt Hàng
    const handlePlaceOrder = async (values) => {
        setLoading(true);
        try {
            // 1. Chuẩn bị dữ liệu gửi lên Backend (Mapping key cho khớp DTO Java)
            const orderData = {
                customer_name: values.fullName,   // Java: @JsonProperty("customer_name")
                phone_number: values.phone,       // Java: @JsonProperty("phone_number")
                address: values.address,
                note: values.note,
                payment_method: values.paymentMethod, // Java: @JsonProperty("payment_method")
                total_money: finalTotal,          // Java: @JsonProperty("total_money")
                user_id: user ? user.id : null,   // Gửi user_id nếu đã đăng nhập

                // Danh sách sản phẩm (Mapping key)
                order_details: cartItems.map(item => ({
                    product_id: item.id,          // Java: @JsonProperty("product_id")
                    variant_id: item.variantId,   // Java: @JsonProperty("variant_id")
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            console.log("Dữ liệu gửi đi:", orderData);

            // 2. Gọi API tạo đơn THẬT
            await orderService.createOrder(orderData);
            
            // 3. Thông báo thành công
            message.success('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
            
            // 4. Xóa giỏ hàng & Chuyển trang
            clearCart(); 
            navigate('/'); // Hoặc navigate('/order-success') nếu bạn làm trang đó

        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            const errorMsg = error.response?.data || 'Đặt hàng thất bại, vui lòng thử lại!';
            message.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) return null;

    return (
        <div className="checkout-container py-20">
            <div className="container">
                <Title level={2} style={{ marginBottom: 20, textAlign: 'center' }}>
                    THANH TOÁN
                </Title>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handlePlaceOrder}
                    initialValues={{ paymentMethod: 'COD' }}
                >
                    <Row gutter={24}>
                        {/* --- CỘT TRÁI: THÔNG TIN GIAO HÀNG --- */}
                        <Col xs={24} md={14}>
                            <Card title="Thông tin giao hàng" className="checkout-card mb-20">
                                <Form.Item
                                    name="fullName"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" size="large" />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                                    ]}
                                >
                                    <Input prefix={<PhoneOutlined />} placeholder="0987..." size="large" />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    label="Địa chỉ nhận hàng"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <TextArea rows={3} placeholder="Số nhà, đường, phường/xã..." />
                                </Form.Item>

                                <Form.Item name="note" label="Ghi chú đơn hàng (Tùy chọn)">
                                    <TextArea rows={2} placeholder="Ví dụ: Giao giờ hành chính..." />
                                </Form.Item>
                            </Card>

                            <Card title="Phương thức thanh toán" className="checkout-card">
                                <Form.Item name="paymentMethod" noStyle>
                                    <Radio.Group className="payment-method-radio">
                                        <Radio value="COD" className="d-flex align-center">
                                            <div style={{ marginLeft: 8 }}>
                                                <Text strong>Thanh toán khi nhận hàng (COD)</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: 12 }}>Bạn chỉ phải thanh toán khi đã nhận được hàng.</Text>
                                            </div>
                                        </Radio>
                                        <Radio value="BANK" disabled className="d-flex align-center">
                                            <div style={{ marginLeft: 8 }}>
                                                <Text strong>Chuyển khoản ngân hàng (QR Code)</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: 12 }}>Đang bảo trì...</Text>
                                            </div>
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Card>
                        </Col>

                        {/* --- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG --- */}
                        <Col xs={24} md={10}>
                            <Card title="Đơn hàng của bạn" className="checkout-card summary-card">
                                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: 15 }}>
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="order-summary-item">
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <img src={item.thumbnail} alt="prod" className="summary-img" />
                                                <div>
                                                    <Text strong style={{ fontSize: 14, display: 'block' }}>{item.name}</Text>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        Size: {item.size} | {item.color} | x{item.quantity}
                                                    </Text>
                                                </div>
                                            </div>
                                            <Text strong>{formatPrice(item.price * item.quantity)}</Text>
                                        </div>
                                    ))}
                                </div>

                                <Divider />

                                <div className="total-row">
                                    <Text type="secondary">Tạm tính:</Text>
                                    <Text>{formatPrice(subTotal)}</Text>
                                </div>
                                <div className="total-row">
                                    <Text type="secondary">Phí vận chuyển:</Text>
                                    <Text>{formatPrice(shippingFee)}</Text>
                                </div>

                                <Divider style={{ margin: '15px 0' }} />

                                <div className="total-row" style={{ alignItems: 'center' }}>
                                    <Text strong style={{ fontSize: 18 }}>Tổng cộng:</Text>
                                    <Text type="danger" strong style={{ fontSize: 24 }}>
                                        {formatPrice(finalTotal)}
                                    </Text>
                                </div>

                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    block 
                                    size="large"
                                    loading={loading}
                                    style={{ marginTop: 25, height: 50, fontSize: 18, fontWeight: 'bold' }}
                                    icon={<DollarOutlined />}
                                >
                                    ĐẶT HÀNG
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default CheckoutPage;