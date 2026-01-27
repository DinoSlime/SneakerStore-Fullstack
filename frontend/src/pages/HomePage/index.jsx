import React, { useEffect, useState } from 'react';
import { Button, Typography, Carousel, Row, Col, Card, message, Spin } from 'antd';
import { RocketOutlined, SafetyCertificateOutlined, CustomerServiceOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import productService from '../../services/productService';
import './HomePage.css';

const { Title, Text } = Typography;
const { Meta } = Card;

// --- 1. CONSTANTS & CONFIG ---
const FALLBACK_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";
const BANNER_IMAGE = "https://images.unsplash.com/photo-1556906781-9a412961d289?auto=format&fit=crop&w=1600&q=80";

const SERVICE_ITEMS = [
    { id: 1, icon: <RocketOutlined />, title: "Giao Hàng Hỏa Tốc", desc: "Nhận hàng trong vòng 2h" },
    { id: 2, icon: <SafetyCertificateOutlined />, title: "Cam Kết Chính Hãng", desc: "Hoàn tiền 111% nếu hàng giả" },
    { id: 3, icon: <CustomerServiceOutlined />, title: "Hỗ Trợ 24/7", desc: "Luôn sẵn sàng giải đáp" },
];

// --- 2. HELPER FUNCTIONS ---
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// --- 3. SUB-COMPONENTS ---
const ProductCard = ({ product }) => (
    <Card
        hoverable
        className="cursor-pointer product-card-hover"
        cover={
            <img 
                alt={product.name} 
                src={product.thumbnail || FALLBACK_IMAGE} 
                className="product-img" 
            />
        }
        actions={[
            <ShoppingCartOutlined key="cart" onClick={() => message.success('Đã thêm vào giỏ hàng!')} />,
            <Button type="link" size="small">Xem chi tiết</Button>
        ]}
    >
        <Meta 
            title={product.name} 
            description={
                <Text className="text-danger font-bold" style={{ fontSize: '16px' }}>
                    {formatPrice(product.price)}
                </Text>
            } 
        />
    </Card>
);

// --- 4. MAIN COMPONENT ---
const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Sử dụng .getAll() đồng bộ với Service
            const res = await productService.getAll();
            
            const data = res.data?.content || res.data || [];
            
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error);
            message.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="homepage-content">
            {/* 1. BANNER SECTION */}
            <Carousel autoplay effect="fade">
                            <div className="banner-wrapper" style={{ backgroundImage: `url('${BANNER_IMAGE}')` }}>
                {/* Overlay phải có d-flex và căn giữa */}
                <div className="banner-overlay d-flex flex-column justify-center align-center">
                    <Title level={1} className="text-white mb-10">BST MÙA HÈ 2026</Title>
                    <Text className="text-white mb-20" style={{ fontSize: '18px' }}>
                        Khám phá phong cách mới nhất
                    </Text>
                    <Button type="primary" size="large" shape="round" className="font-bold px-20">
                        MUA NGAY
                    </Button>
                </div>
            </div>
            </Carousel>

            <div className="container py-20">
                {/* 2. SERVICES SECTION */}
                <Row gutter={[32, 32]} className="text-center mb-40 mt-20">
                    {SERVICE_ITEMS.map(item => (
                        <Col xs={24} md={8} key={item.id}>
                            <div className="service-icon">{item.icon}</div>
                            <Title level={4}>{item.title}</Title>
                            <Text type="secondary">{item.desc}</Text>
                        </Col>
                    ))}
                </Row>

                {/* 3. PRODUCTS SECTION */}
                <div className="text-center mb-40">
                    <Title level={2}>Sản Phẩm Mới Nhất</Title>
                    <div style={{ width: '60px', height: '4px', background: 'var(--primary-color)', margin: '0 auto' }}></div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <Spin size="large" tip="Đang tải sản phẩm...">
                            <div style={{ padding: '50px' }} />
                        </Spin>
                    </div>
                ) : (
                    <Row gutter={[24, 24]}>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))
                        ) : (
                            <div className="w-100 text-center">
                                <Text type="secondary">Chưa có sản phẩm nào.</Text>
                            </div>
                        )}
                    </Row>
                )}

                <div className="text-center mt-20 mb-20">
                     <Button size="large">Xem tất cả sản phẩm</Button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;