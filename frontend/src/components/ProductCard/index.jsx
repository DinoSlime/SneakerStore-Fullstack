import React from 'react';
import { Card, Button, Typography, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css'; 
import { formatPrice } from '../../utils/format';
const { Meta } = Card;
const { Text } = Typography;

const FALLBACK_IMAGE = "https://placehold.co/300x300?text=No+Image";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); 
        message.success('Đã thêm vào giỏ hàng!');
    };

    return (
        <Card
            hoverable
            className="cursor-pointer product-card-hover"
            onClick={handleCardClick}
            cover={
                
                <div className="product-img-wrapper">
                    <img 
                        alt={product.name} 
                        src={product.thumbnail || FALLBACK_IMAGE} 
                        className="product-img" 
                        
                    />
                </div>
            }
            actions={[
                <ShoppingCartOutlined key="cart" className="cart-icon-action" onClick={handleAddToCart} />,
                <Button 
                    type="link" 
                    size="small"
                    className="view-detail-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                    }}
                >
                    Xem chi tiết
                </Button>
            ]}
        >
            <Meta 
                title={product.name} 
                description={
                    <Text className="price-text">
                        {formatPrice(product.price)}
                    </Text>
                } 
            />
        </Card>
    );
};

export default ProductCard;