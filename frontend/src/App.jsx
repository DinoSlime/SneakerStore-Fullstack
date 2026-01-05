import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [categories, setCategories] = useState([]); // Chứa danh sách lấy từ API

  useEffect(() => {
    axios.get('http://localhost:8080/api/categories')
      .then((response) => {
        setCategories(response.data); // Lưu dữ liệu vào biến state
      })
      .catch((error) => {
        console.error("Lỗi gọi API:", error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">👟 Sneaker Store Demo</h1>
      
      <div className="card">
        <div className="card-header bg-dark text-white">
          Danh sách Hãng giày (Lấy từ MySQL)
        </div>
        <div className="card-body">
          {categories.length === 0 ? (
            <p className="text-muted">Chưa có dữ liệu hoặc Server chưa bật...</p>
          ) : (
            <ul className="list-group">
              {categories.map((category) => (
                <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {category.name}
                  <span className="badge bg-secondary rounded-pill">ID: {category.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;