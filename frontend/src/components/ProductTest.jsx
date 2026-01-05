import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductTest = () => {
    // --- STATE 1: SẢN PHẨM & TÌM KIẾM ---
    const [products, setProducts] = useState([]);
    const [detail, setDetail] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
    
    // --- STATE 2: DANH MỤC (CATEGORIES) - MỚI THÊM ---
    const [categories, setCategories] = useState([]);

    // --- STATE 3: FORM THÊM SẢN PHẨM ---
    const [newProduct, setNewProduct] = useState({
        name: '', price: 0, thumbnail: '', description: '', category_id: 1
    });

    // --- STATE 4: AUTH (ĐĂNG KÝ & ĐĂNG NHẬP) ---
    const [registerData, setRegisterData] = useState({
        phoneNumber: '', password: '', fullName: '', address: '',
        dateOfBirth: '2000-01-01', facebookAccountId: 0, googleAccountId: 0, role_id: 1
    });
    const [loginData, setLoginData] = useState({ phoneNumber: '', password: '' });

    // --- STYLE CHUNG ---
    const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#fff', color: '#333', fontSize: '14px', outline: 'none' };
    const cardStyle = { background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '20px' };

    // --- CÁC HÀM GỌI API ---

    // 1. Lấy danh sách sản phẩm
    const fetchProducts = async () => {
        try { const res = await axios.get('http://localhost:8080/api/products'); setProducts(res.data); setDetail(null); } catch (err) { alert('Lỗi Products: ' + err.message); }
    };

    // 2. (MỚI) Lấy danh sách danh mục
    const fetchCategories = async () => {
        try { const res = await axios.get('http://localhost:8080/api/categories'); setCategories(res.data); } catch (err) { console.error('Lỗi Categories: ' + err.message); }
    };

    // 3. Tìm kiếm
    const handleSearch = async () => {
        try { const res = await axios.get(`http://localhost:8080/api/products/search`, { params: { keyword, minPrice, maxPrice } }); setProducts(res.data); } catch (err) { alert('Lỗi Search: ' + err.message); }
    };

    // 4. Xem chi tiết
    const viewDetail = async (id) => {
        try { const res = await axios.get(`http://localhost:8080/api/products/${id}`); setDetail(res.data); } catch (err) { alert('Lỗi Detail: ' + err.message); }
    };

    // 5. Đăng nhập
    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:8080/api/users/login', loginData);
            localStorage.setItem("token", res.data.token);
            alert("✅ Đăng nhập thành công! Token đã lưu.");
        } catch (err) { alert("❌ Lỗi Login: " + (err.response?.data || err.message)); }
    };

    // 6. Thêm sản phẩm
    const handleCreateProduct = async () => {
        const token = localStorage.getItem("token");
        if (!token) { alert("⚠️ Chưa đăng nhập (Thiếu Token)!"); return; }
        try {
            await axios.post('http://localhost:8080/api/products', newProduct, { headers: { Authorization: `Bearer ${token}` } });
            alert("✅ Thêm sản phẩm thành công!");
            fetchProducts();
        } catch (err) { alert("❌ Lỗi Create: " + (err.response?.data || err.message)); }
    };

    // 7. Đăng ký
    const handleRegister = async () => {
        try { await axios.post('http://localhost:8080/api/users/register', registerData); alert("✅ Đăng ký thành công!"); } catch (err) { alert("❌ Lỗi Register: " + (err.response?.data || err.message)); }
    };

    // Chạy khi load trang
    useEffect(() => {
        fetchProducts();
        fetchCategories(); // Gọi thêm hàm này
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto', background: '#f4f6f8', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}>🚀 DASHBOARD TEST API (FULL)</h1>

            {/* --- KHUNG 1: TÀI KHOẢN --- */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ ...cardStyle, flex: 1, borderTop: '4px solid #2196F3' }}>
                    <h3 style={{ color: '#1976D2', marginTop: 0 }}>👤 1. Đăng ký</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input style={inputStyle} placeholder="SĐT..." value={registerData.phoneNumber} onChange={e => setRegisterData({...registerData, phoneNumber: e.target.value})} />
                        <input style={inputStyle} type="password" placeholder="Pass..." value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} />
                        <button onClick={handleRegister} style={{ background: '#2196F3', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Đăng ký</button>
                    </div>
                </div>

                <div style={{ ...cardStyle, flex: 1, borderTop: '4px solid #4CAF50' }}>
                    <h3 style={{ color: '#388E3C', marginTop: 0 }}>🔑 2. Đăng nhập</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input style={inputStyle} placeholder="SĐT..." value={loginData.phoneNumber} onChange={e => setLoginData({...loginData, phoneNumber: e.target.value})} />
                        <input style={inputStyle} type="password" placeholder="Pass..." value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
                        <button onClick={handleLogin} style={{ background: '#4CAF50', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Lấy Token</button>
                    </div>
                </div>
            </div>

            {/* --- KHUNG 2: QUẢN LÝ SẢN PHẨM --- */}
            <div style={{ ...cardStyle, borderTop: '4px solid #FF9800' }}>
                <h3 style={{ color: '#F57C00', marginTop: 0 }}>👟 3. Thêm Giày (Cần Token)</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input style={{...inputStyle, flex: 2}} placeholder="Tên giày..." value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    <input style={{...inputStyle, flex: 1}} type="number" placeholder="Giá..." value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                    
                    {/* Select Box chọn Category ID */}
                    <select style={{...inputStyle, flex: 1}} value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: parseInt(e.target.value)})}>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
                        ))}
                    </select>

                    <button onClick={handleCreateProduct} style={{ background: '#FF9800', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu</button>
                </div>
            </div>

            {/* --- KHUNG 3: TÌM KIẾM --- */}
            <div style={{ ...cardStyle }}>
                <h3 style={{marginTop: 0}}>🔍 4. Tìm kiếm nâng cao</h3>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <input style={{...inputStyle, flex: 2}} placeholder="Nhập tên giày..." value={keyword} onChange={e => setKeyword(e.target.value)} />
                    <input style={{...inputStyle, flex: 1}} type="number" placeholder="Min giá" value={minPrice} onChange={e => setMinPrice(e.target.value)}/>
                    <input style={{...inputStyle, flex: 1}} type="number" placeholder="Max giá" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/>
                    <button onClick={handleSearch} style={{ background: '#607D8B', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Tìm</button>
                    <button onClick={fetchProducts} style={{ background: '#9E9E9E', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reset</button>
                </div>
            </div>

            {/* --- KHUNG 4: DANH SÁCH & CHI TIẾT --- */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                
                {/* DANH SÁCH CATEGORIES (MỚI THÊM VÀO) */}
                <div style={{ width: '250px', ...cardStyle }}>
                    <h3 style={{ marginTop: 0, color: '#673AB7' }}>📂 Danh mục</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {categories.length === 0 && <li>Đang tải...</li>}
                        {categories.map(c => (
                            <li key={c.id} style={{ padding: '10px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                                #{c.id} - {c.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* DANH SÁCH SẢN PHẨM */}
                <div style={{ flex: 1, ...cardStyle }}>
                    <h3 style={{ marginTop: 0 }}>📦 Sản phẩm ({products.length})</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {products.map(p => (
                            <li key={p.id} style={{ marginBottom: '10px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div><strong style={{fontSize: '1.1em'}}>{p.name}</strong> <span style={{color: 'green'}}>{p.price.toLocaleString()} đ</span></div>
                                <button onClick={() => viewDetail(p.id)} style={{ padding: '5px 10px', border: '1px solid #2196F3', color: '#2196F3', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Chi tiết</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CHI TIẾT */}
                {detail && (
                    <div style={{ flex: 1, border: '2px dashed #4CAF50', padding: '20px', borderRadius: '10px', background: '#E8F5E9', height: 'fit-content' }}>
                        <h3 style={{ color: '#2E7D32', marginTop: 0 }}>Chi tiết sản phẩm</h3>
                        <p><strong>ID:</strong> {detail.id}</p>
                        <p><strong>Tên:</strong> {detail.name}</p>
                        <p><strong>Giá:</strong> {detail.price.toLocaleString()} VNĐ</p>
                        <p><strong>Mô tả:</strong> {detail.description}</p>
                        <div style={{marginTop: '15px', padding: '15px', background: '#fff', borderRadius: '5px'}}>
                            <strong>🔗 HATEOAS Links:</strong>
                            {detail._links ? (
                                <ul style={{ fontSize: '0.9em', wordBreak: 'break-all', paddingLeft: '20px' }}>
                                    <li><a href={detail._links.self.href}>Self Link</a></li>
                                    <li><a href={detail._links['list-products'].href}>Back to List</a></li>
                                </ul>
                            ) : <p style={{color: 'red'}}>No links</p>}
                        </div>
                        <button onClick={() => setDetail(null)} style={{marginTop: '15px', width: '100%', padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Đóng</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTest;