import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; 
import HomePage from './pages/HomePage';       
import './assets/styles/global.css';
function App() {
  return (
    <Routes>
      
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>


    
    </Routes>
  );
}

export default App;