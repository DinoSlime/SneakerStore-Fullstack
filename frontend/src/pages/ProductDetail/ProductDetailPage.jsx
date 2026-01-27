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
    const [availableSizes, setAvailableSizes] = useState([]);
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        fetchProductDetail();
        window.scrollTo(0, 0); 
    }, [id]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            const res = await productService.getById(id);
            const data = res.data; // Dữ liệu từ API
            
            setProduct(data);
            
            // 1. Set ảnh mặc định là ảnh thumbnail
            setMainImage(data.thumbnail);

            // 2. Xử lý Variants để lấy danh sách Size (Loại bỏ size trùng nhau)
            if (data.variants && data.variants.length > 0) {
                // Lọc các size unique và sắp xếp tăng dần
                const uniqueSizes = [...new Set(data.variants.map(v => v.size))].sort((a, b) => a - b);
                setAvailableSizes(uniqueSizes);
            }

        } catch (error) {
            console.error("Lỗi:", error);
            message.error("Không tìm thấy sản phẩm!");
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    // Hàm lấy thông tin Variant đang chọn (để biết còn hàng hay không, ID là gì)
    const getSelectedVariant = () => {
        if (!product || !selectedSize) return null;
        // Tìm variant khớp với size đã chọn (Lấy cái đầu tiên tìm thấy)
        return product.variants.find(v => v.size === selectedSize);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            message.warning('Vui lòng chọn Size giày!');
            return;
        }

        const currentVariant = getSelectedVariant();
        
        // Kiểm tra tồn kho
        if (currentVariant && currentVariant.stock < quantity) {
            message.error(`Size ${selectedSize} chỉ còn lại ${currentVariant.stock} sản phẩm!`);
            return;
        }

        // Logic thêm giỏ hàng (Sau này sẽ gọi API cart)
        console.log("Add to cart:", {
            productId: product.id,
            variantId: currentVariant?.id, // ID quan trọng để lưu vào DB Order
            quantity: quantity
        });
        
        message.success(`Đã thêm ${product.name} (Size ${selectedSize}) vào giỏ hàng!`);
    };

    if (loading) return <div className="spinner-center"><Spin size="large" /></div>;
    if (!product) return null;

    // Lấy danh sách tất cả ảnh (Thumbnail + Ảnh từ variants nếu có)
    const galleryImages = [
        product.thumbnail,
        ...(product.variants?.map(v => v.imageUrl).filter(url => url) || []) // Lấy ảnh variant nếu ko null
    ].slice(0, 5); // Lấy tối đa 5 ảnh để hiển thị demo

    return (
        <div className="product-detail-container container py-20">
            <Row gutter={[40, 40]}>
                {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
                <Col xs={24} md={12}>
                    <div className="product-image-wrapper">
                        <Image 
                            src={mainImage || "https://placehold.co/500x500?text=No+Image"} 
                            alt={product.name}
                            className="main-image"
                        />
                    </div>
                    
                    {/* List ảnh nhỏ dynamic từ DB */}
                    <div className="thumbnail-list mt-20 d-flex gap-sm">
                        {galleryImages.map((img, index) => (
                             <div 
                                key={index} 
                                className={`thumb-item cursor-pointer ${mainImage === img ? 'active' : ''}`}
                                onClick={() => setMainImage(img)} // Bấm vào để đổi ảnh chính
                             >
                                <img src={img} alt="thumb" />
                             </div>
                        ))}
                    </div>
                </Col>

                {/* --- CỘT PHẢI: THÔNG TIN --- */}
                <Col xs={24} md={12}>
                    <div className="product-info-wrapper">
                        <Tag color="blue" className="mb-10">{product.category?.name || "Sneaker"}</Tag>
                        <Title level={2} style={{ margin: '5px 0' }}>{product.name}</Title>
                        
                        <div className="d-flex align-center gap-md mb-20">
                            <Rate disabled defaultValue={5} style={{ fontSize: 14 }} />
                            <Text type="secondary">(Hàng chính hãng)</Text>
                        </div>

                        <Title level={3} className="text-danger price-tag">
                            {formatPrice(product.price)}
                        </Title>

                        <Paragraph className="product-desc">
                            {product.description || "Mô tả đang cập nhật..."} 
                        </Paragraph>

                        <Divider />

                       
                        <div className="mb-20">
                            <Text strong className="d-block mb-10">
                                Chọn Size: {selectedSize && <Tag color="green">Size {selectedSize}</Tag>}
                            </Text>
                            
                            {availableSizes.length > 0 ? (
                                <Radio.Group 
                                    value={selectedSize} 
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    buttonStyle="solid"
                                >
                                    {availableSizes.map(size => {
                                        
                                        const variantForSize = product.variants.find(v => v.size === size);
                                        const isOutOfStock = variantForSize ? variantForSize.stock <= 0 : true;

                                        return (
                                            <Radio.Button 
                                                key={size} 
                                                value={size} 
                                                disabled={isOutOfStock} 
                                                className="size-btn"
                                            >
                                                {size}
                                            </Radio.Button>
                                        );
                                    })}
                                </Radio.Group>
                            ) : (
                                <Tag color="red">Tạm hết hàng</Tag>
                            )}
                        </div>

                        {/* Chọn Số lượng */}
                        <div className="mb-20">
                            <Text strong className="d-block mb-10">Số lượng:</Text>
                            <InputNumber 
                                min={1} 
                                max={getSelectedVariant()?.stock} 
                                value={quantity} 
                                onChange={setQuantity} 
                                size="large"
                            />
                            {selectedSize && getSelectedVariant() && (
                                <Text type="secondary" className="ml-10">
                                    (Còn {getSelectedVariant().stock} sản phẩm)
                                </Text>
                            )}
                        </div>

                        {/* Nút Action */}
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

                        {/* Cam kết */}
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