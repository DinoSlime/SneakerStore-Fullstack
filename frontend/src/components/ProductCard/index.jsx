import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div style={styles.card}>
            {/* Vùng ảnh sản phẩm */}
            <div style={styles.imageContainer}>
                <img 
                    src={product.thumbnail || "https://via.placeholder.com/300"} 
                    alt={product.name} 
                    style={styles.image} 
                />
                {/* Nhãn giảm giá (Giả lập cho đẹp) */}
                <span style={styles.badge}>New</span>
            </div>

            {/* Vùng thông tin */}
            <div style={styles.info}>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.category}>Sneaker Authentic</p>
                
                <div style={styles.row}>
                    <span style={styles.price}>
                        {product.price.toLocaleString()} ₫
                    </span>
                    <Link to={`/products/${product.id}`} style={styles.button}>
                        Chi tiết
                    </Link>
                </div>
            </div>
        </div>
    );
};


const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid #f0f0f0'
    },
    imageContainer: {
        width: '100%',
        height: '200px', // Cố định chiều cao ảnh để không bị lệch
        backgroundColor: '#f9f9f9',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain', // Giúp ảnh không bị méo
        padding: '10px'
    },
    badge: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: '#ff4d4f',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    info: {
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    name: {
        fontSize: '16px',
        fontWeight: '600',
        margin: '0 0 5px 0',
        color: '#333',
        display: '-webkit-box',
        WebkitLineClamp: 2, // Cắt tên dài quá 2 dòng
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    category: {
        fontSize: '13px',
        color: '#888',
        margin: '0 0 15px 0',
    },
    row: {
        marginTop: 'auto', // Đẩy giá và nút xuống đáy
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#2f54eb',
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#20232a',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '500',
    }
};

export default ProductCard;