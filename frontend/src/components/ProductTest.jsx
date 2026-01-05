import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductTest = () => {
    // --- STATE CŨ (HIỂN THỊ & TÌM KIẾM) ---
    const [products, setProducts] = useState([]);
    const [detail, setDetail] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);

    // --- STATE MỚI (THÊM SẢN PHẨM) ---
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        thumbnail: '',
        description: '',
        category_id: 1
    });

    // --- STATE MỚI (ĐĂNG KÝ USER) ---
    const [registerData, setRegisterData] = useState({
        phoneNumber: '',
        password: '',
        fullName: '',
        address: '',
        dateOfBirth: '2000-01-01',
        facebookAccountId: 0,
        googleAccountId: 0,
        role_id: 1
    });

    // --- STYLE CHUNG CHO INPUT (Cho dễ nhìn) ---
    const inputStyle = {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#fff', // Nền trắng tuyệt đối
        color: '#333',           // Chữ đen đậm
        fontSize: '14px',
        outline: 'none'
    };

    // 1. Hàm lấy tất cả sản phẩm
    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/products');
            setProducts(res.data);
            setDetail(null);
        } catch (err) {
            alert('Lỗi lấy danh sách: ' + err.message);
        }
    };

    // 2. Hàm tìm kiếm phức tạp
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

    // 3. Hàm xem chi tiết & Check HATEOAS
    const viewDetail = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/products/${id}`);
            setDetail(res.data);
        } catch (err) {
            alert('Lỗi xem chi tiết: ' + err.message);
        }
    };

    // 4. Hàm Thêm sản phẩm
    const handleCreateProduct = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post('http://localhost:8080/api/products', newProduct, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            alert("✅ Thêm sản phẩm thành công!");
            fetchProducts();
        } catch (err) {
            alert("❌ Lỗi thêm sản phẩm: " + (err.response?.data || err.message));
        }
    };

    // 5. Hàm Đăng ký User
    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:8080/api/users/register', registerData);
            alert("✅ Đăng ký thành công! Hãy thử đăng nhập.");
        } catch (err) {
            alert("❌ Lỗi đăng ký: " + (err.response?.data || err.message));
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto', background: '#f9f9f9', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>🚀 BẢNG TEST FULL API (MIDTERM)</h1>

            {/* --- KHUNG QUẢN TRỊ --- */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                
                {/* FORM ĐĂNG KÝ */}
                <div style={{ flex: 1, minWidth: '300px', border: '1px solid #90CAF9', padding: '20px', borderRadius: '10px', background: '#E3F2FD', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#1565C0', marginTop: 0 }}>👤 Đăng ký User mới</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input style={inputStyle} placeholder="Số điện thoại..." value={registerData.phoneNumber} onChange={e => setRegisterData({...registerData, phoneNumber: e.target.value})} />
                        <input style={inputStyle} type="password" placeholder="Mật khẩu..." value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} />
                        <input style={inputStyle} placeholder="Họ và tên..." value={registerData.fullName} onChange={e => setRegisterData({...registerData, fullName: e.target.value})} />
                        <input style={inputStyle} placeholder="Địa chỉ..." value={registerData.address} onChange={e => setRegisterData({...registerData, address: e.target.value})} />
                        <button onClick={handleRegister} style={{ background: '#1976D2', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Đăng ký ngay</button>
                    </div>
                </div>

                {/* FORM THÊM SẢN PHẨM */}
                <div style={{ flex: 1, minWidth: '300px', border: '1px solid #FFCC80', padding: '20px', borderRadius: '10px', background: '#FFF3E0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#E65100', marginTop: 0 }}>👟 Thêm giày mới (Admin)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input style={inputStyle} placeholder="Tên giày..." value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                        <div style={{display:'flex', gap: '10px'}}>
                            <input style={{...inputStyle, flex: 1}} type="number" placeholder="Giá..." value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                            <input style={{...inputStyle, flex: 1}} type="number" placeholder="Cat ID..." value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: parseInt(e.target.value)})} />
                        </div>
                        <input style={inputStyle} placeholder="URL Ảnh..." value={newProduct.thumbnail} onChange={e => setNewProduct({...newProduct, thumbnail: e.target.value})} />
                        <input style={inputStyle} placeholder="Mô tả..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                        <button onClick={handleCreateProduct} style={{ background: '#F57C00', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu sản phẩm</button>
                    </div>
                </div>
            </div>

            <hr style={{margin: '30px 0', borderColor: '#ddd'}} />

            {/* --- KHUNG TÌM KIẾM --- */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h3>🔍 Tìm kiếm & Lọc (Truy vấn phức tạp)</h3>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <input 
                        style={{...inputStyle, flex: 2}}
                        placeholder="Nhập tên giày..." 
                        value={keyword} onChange={e => setKeyword(e.target.value)} 
                    />
                    <input 
                        style={{...inputStyle, flex: 1}}
                        type="number" placeholder="Giá thấp nhất" 
                        value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    />
                    <input 
                        style={{...inputStyle, flex: 1}}
                        type="number" placeholder="Giá cao nhất" 
                        value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    />
                    <button onClick={handleSearch} style={{ background: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Tìm ngay</button>
                    <button onClick={fetchProducts} style={{ background: '#9E9E9E', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reset</button>
                </div>
            </div>

            {/* --- DANH SÁCH & CHI TIẾT --- */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3>📦 Danh sách giày ({products.length})</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {products.map(p => (
                            <li key={p.id} style={{ marginBottom: '10px', padding: '15px', background: '#fff', border: '1px solid #eee', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                <div>
                                    <strong style={{fontSize: '1.1em', color: '#333'}}>{p.name}</strong>
                                    <div style={{color: 'green', fontWeight: 'bold'}}>{p.price.toLocaleString()} VNĐ</div>
                                </div>
                                <button onClick={() => viewDetail(p.id)} style={{ padding: '5px 10px', background: '#fff', border: '1px solid #2196F3', color: '#2196F3', borderRadius: '4px', cursor: 'pointer' }}>Xem HATEOAS</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* KHUNG CHI TIẾT & HATEOAS */}
                {detail && (
                    <div style={{ flex: 1, minWidth: '300px', border: '2px dashed #4CAF50', padding: '20px', borderRadius: '10px', background: '#F1F8E9', height: 'fit-content' }}>
                        <h3 style={{ color: '#2E7D32', marginTop: 0 }}>Chi tiết sản phẩm</h3>
                        <p><strong>ID:</strong> {detail.id}</p>
                        <p><strong>Tên:</strong> {detail.name}</p>
                        <p><strong>Giá:</strong> {detail.price.toLocaleString()} VNĐ</p>
                        <p><strong>Mô tả:</strong> {detail.description}</p>
                        <div style={{marginTop: '15px', padding: '15px', background: '#fff', borderRadius: '5px', border: '1px solid #C8E6C9'}}>
                            <strong>🔗 Links HATEOAS:</strong>
                            {detail._links ? (
                                <ul style={{ fontSize: '0.9em', wordBreak: 'break-all', color: '#555', paddingLeft: '20px' }}>
                                    <li>Self: <a href={detail._links.self.href}>{detail._links.self.href}</a></li>
                                    <li>List: <a href={detail._links['list-products'].href}>{detail._links['list-products'].href}</a></li>
                                </ul>
                            ) : (
                                <p style={{color: 'red'}}>Không tìm thấy Link!</p>
                            )}
                        </div>
                        <button onClick={() => setDetail(null)} style={{marginTop: '15px', width: '100%', padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Đóng</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTest;