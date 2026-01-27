import React, { useEffect, useState } from 'react';
import productService from '../../services/productService'; 
import ProductCard from '../../components/ProductCard';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getAll({ page: 0, limit: 20 });
                const list = response.data.content || response.data;
                setProducts(list);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            
            <div style={styles.banner}>
                <h1 style={{ margin: 0, fontSize: '2.5rem' }}>SUMMER SALE 2026 👟</h1>
                <p>Giảm giá 50% cho các dòng giày chạy bộ</p>
            </div>

            <h2 style={styles.sectionTitle}>🔥 Sản phẩm mới nhất</h2>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Đang tải dữ liệu...</p>
            ) : (
                <div style={styles.gridContainer}>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p>Chưa có sản phẩm nào.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    banner: {
        backgroundColor: '#20232a', 
        color: 'white',
        padding: '60px 20px',
        borderRadius: '16px',
        textAlign: 'center',
        marginBottom: '40px',
        backgroundImage: 'linear-gradient(45deg, #20232a 0%, #4a5568 100%)', 
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        borderLeft: '5px solid #2f54eb',
        paddingLeft: '15px',
        color: '#333'
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '25px',
    }
};

export default HomePage;