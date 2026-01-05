import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductTest = () => {
    const [products, setProducts] = useState([]);
    const [detail, setDetail] = useState(null);
    
    // State cho tìm kiếm
    const [keyword, setKeyword] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);

    // 1. Hàm lấy tất cả sản phẩm
    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/products');
            setProducts(res.data);
            setDetail(null); // Tắt bảng chi tiết nếu đang mở
        } catch (err) {
            alert('Lỗi lấy danh sách: ' + err.message);
        }
    };

    // 2. Hàm tìm kiếm phức tạp (Tên + Khoảng giá) -> Yêu cầu giữa kỳ
    const handleSearch = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/products/search`, {
                params: { keyword, minPrice, maxPrice }
            });
            setProducts(res.data);
        } catch (err) {
            alert('Lỗi tìm kiếm: ' + err.message);
        }
    };

    // 3. Hàm xem chi tiết & Check HATEOAS -> Yêu cầu giữa kỳ
    const viewDetail = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/products/${id}`);
            setDetail(res.data);
            console.log("Dữ liệu HATEOAS nhận được:", res.data._links); // Mở F12 xem cái này
        } catch (err) {
            alert('Lỗi xem chi tiết: ' + err.message);
        }
    };

    // Chạy lần đầu khi vào trang
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>🛒 Test Module Sản Phẩm</h2>
            
            {/* KHUNG TÌM KIẾM */}
            <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
                <h3>🔍 Tìm kiếm (Truy vấn phức tạp)</h3>
                <input 
                    placeholder="Nhập tên giày..." 
                    value={keyword} onChange={e => setKeyword(e.target.value)} 
                    style={{ marginRight: '10px' }}
                />
                <input 
                    type="number" placeholder="Giá thấp nhất" 
                    value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    style={{ marginRight: '10px' }} 
                />
                <input 
                    type="number" placeholder="Giá cao nhất" 
                    value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    style={{ marginRight: '10px' }} 
                />
                <button onClick={handleSearch} style={{ background: 'blue', color: 'white' }}>Tìm ngay</button>
                <button onClick={fetchProducts} style={{ marginLeft: '10px' }}>Reset</button>
            </div>

            {/* DANH SÁCH SẢN PHẨM */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h3>Danh sách giày</h3>
                    <ul>
                        {products.map(p => (
                            <li key={p.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee' }}>
                                <strong>{p.name}</strong> - {p.price} VNĐ <br/>
                                <button onClick={() => viewDetail(p.id)}>Xem chi tiết & HATEOAS</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* KHUNG CHI TIẾT & HATEOAS */}
                {detail && (
                    <div style={{ flex: 1, border: '2px dashed green', padding: '10px' }}>
                        <h3 style={{ color: 'green' }}>Chi tiết sản phẩm (Có HATEOAS)</h3>
                        <p>ID: {detail.id}</p>
                        <p>Tên: {detail.name}</p>
                        <p>Giá: {detail.price}</p>
                        <p>Mô tả: {detail.description}</p>
                        <hr/>
                        <h4>Links HATEOAS (Điểm cộng):</h4>
                        {detail._links ? (
                            <ul style={{ background: '#f0f0f0', padding: '10px' }}>
                                <li>Self: <a href={detail._links.self.href}>{detail._links.self.href}</a></li>
                                <li>Back to List: <a href={detail._links['list-products'].href}>{detail._links['list-products'].href}</a></li>
                            </ul>
                        ) : (
                            <p style={{color: 'red'}}>Chưa thấy link HATEOAS!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTest;