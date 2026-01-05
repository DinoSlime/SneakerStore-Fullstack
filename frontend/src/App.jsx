import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductTest from './components/ProductTest.jsx';

function App() {
  // 1. Biến lưu thông tin đăng nhập
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(''); // Lưu cái chìa khóa JWT

  // 2. Biến lưu danh sách giày
  const [categories, setCategories] = useState([]);

  // Hàm Đăng nhập
  const handleLogin = async () => {
    try {
      // Gửi số điện thoại + pass lên server
      const response = await axios.post('http://localhost:8080/api/users/login', {
        phoneNumber: phoneNumber,
        password: password
      });
      
      // Nếu thành công -> Lưu token lại
      setToken(response.data); 
      alert("Đăng nhập thành công! Token đã về tay.");
    } catch (error) {
      alert("Đăng nhập thất bại: " + (error.response?.data || "Lỗi server"));
    }
  };

  // Hàm lấy danh sách danh mục (Tự chạy khi mở web)
  useEffect(() => {
    axios.get('http://localhost:8080/api/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-5">
      
      <h1 className="text-center text-primary mb-4">👟 Sneaker Store Project</h1>

      <div className="row">
        {/* CỘT TRÁI: FORM ĐĂNG NHẬP */}
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              Login (Dành cho Admin/User)
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label>Số điện thoại:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Nhập 0912345678"
                />
              </div>
              <div className="mb-3">
                <label>Mật khẩu:</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập 123456"
                />
              </div>
              <button onClick={handleLogin} className="btn btn-success w-100">
                Đăng nhập ngay
              </button>

              {/* Khu vực hiển thị Token sau khi đăng nhập */}
              {token && (
                <div className="alert alert-warning mt-3" style={{wordWrap: 'break-word'}}>
                  <strong>Token của bạn:</strong> <br/>
                  {token}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH DANH MỤC */}
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-dark text-white">
              Danh sách Hãng giày (Public API)
            </div>
            <div className="card-body">
              <ul className="list-group">
                {categories.map((cat) => (
                  <li key={cat.id} className="list-group-item">
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ProductTest />
    </div>
    
  );
}

export default App;