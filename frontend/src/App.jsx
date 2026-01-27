import React from 'react';
import AppRouter from './routes/AppRouter'; // Import cái file vừa tạo

function App() {
  // App.jsx giờ chỉ làm đúng 1 việc: Gọi Router ra
  return (
    <div className="App">
       <AppRouter />
    </div>
  );
}

export default App;