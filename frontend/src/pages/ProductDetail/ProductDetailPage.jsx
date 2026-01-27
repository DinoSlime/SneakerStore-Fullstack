import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, Rate, Radio, InputNumber, message, Image, Spin, Divider, Tag } from 'antd';
import { ShoppingCartOutlined, ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons';
import productService from '../../services/productService';
import { formatPrice } from '../../utils/format';
import './ProductDetailPage.css';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    
    const sizes = [38, 39, 40, 41, 42, 43];

    useEffect(() => {
        fetchProductDetail();
        window.scrollTo(0, 0); 
    }, [id]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            const res = await productService.getById(id);
            setProduct(res.data);
        } catch (error) {
            console.error("Lỗi:", error);
            message.error("Không tìm thấy sản phẩm!");
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            message.warning('Vui lòng chọn Size giày!');
            return;
        }
        message.success(`Đã thêm ${product.name} (Size ${selectedSize}) vào giỏ hàng!`);
    };

    if (loading) return <div className="spinner-center"><Spin size="large" /></div>;
    if (!product) return null;

    return (
        <div className="product-detail-container container py-20">
            <Row gutter={[40, 40]}>
               
                <Col xs={24} md={12}>
                    <div className="product-image-wrapper">
                        <Image 
                            
                            src={product.thumbnail || "https://placehold.co/500x500?text=No+Image"} 
                            alt={product.name}
                            className="main-image"
                        />
                    </div>
                    
                    <div className="thumbnail-list mt-20 d-flex gap-sm">
                        {[1, 2, 3].map((_, index) => (
                             <div key={index} className="thumb-item cursor-pointer">
                                <img src={product.thumbnail || "https://placehold.co/100x100?text=Thumb"} alt="thumb" />
                             </div>
                        ))}
                    </div>
                </Col>

               
                <Col xs={24} md={12}>
                    <div className="product-info-wrapper">
                        <Tag color="blue" className="mb-10">NEW ARRIVAL</Tag>
                        <Title level={2} style={{ margin: '5px 0' }}>{product.name}</Title>
                        
                        <div className="d-flex align-center gap-md mb-20">
                            <Rate disabled defaultValue={5} style={{ fontSize: 14 }} />
                            <Text type="secondary">(120 đánh giá)</Text>
                        </div>

                        <Title level={3} className="text-danger price-tag">
                           
                            {formatPrice(product.price)}
                        </Title>

                        <Paragraph className="product-desc">
                            {product.description || "Mô tả đang cập nhật..."} 
                            <br/>
                            Giày sneaker phong cách hiện đại, êm ái, phù hợp cho mọi hoạt động hàng ngày và thể thao nhẹ.
                        </Paragraph>

                        <Divider />

                       
                        <div className="mb-20">
                            <Text strong className="d-block mb-10">Chọn Size:</Text>
                            <Radio.Group 
                                value={selectedSize} 
                                onChange={(e) => setSelectedSize(e.target.value)}
                                buttonStyle="solid"
                            >
                                {sizes.map(size => (
                                    <Radio.Button key={size} value={size} className="size-btn">
                                        {size}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>

                        
                        <div className="mb-20">
                            <Text strong className="d-block mb-10">Số lượng:</Text>
                            <InputNumber 
                                min={1} 
                                max={10} 
                                value={quantity} 
                                onChange={setQuantity} 
                                size="large"
                            />
                        </div>

                       
                        <div className="d-flex gap-md mt-40 action-buttons">
                           
                            <Button 
                                size="large" 
                                icon={<ShoppingCartOutlined />} 
                                className="flex-1 btn-add-cart" 
                                onClick={handleAddToCart}
                            >
                                THÊM VÀO GIỎ
                            </Button>
                            
                           
                            <Button 
                                type="primary"
                                size="large" 
                                icon={<ThunderboltOutlined />} 
                                className="flex-1 btn-buy-now" 
                            >
                                MUA NGAY
                            </Button>
                        </div>

                        
                        <div className="policy-box mt-40">
                            <div className="d-flex gap-sm align-center mb-10">
                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                <Text>Hàng chính hãng 100%</Text>
                            </div>
                            <div className="d-flex gap-sm align-center">
                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                <Text>Đổi trả miễn phí trong 7 ngày</Text>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetailPage;