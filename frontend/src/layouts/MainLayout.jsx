import React from 'react';
import { Outlet } from 'react-router-dom'; 

const MainLayout = () => {
    return (
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
           
            {/* <Header /> */}

            {/* Phần thân trang (Sẽ co giãn để đẩy Footer xuống đáy) */}
            <main style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
               
                <Outlet />
            </main>

           
            {/* <Footer /> */}

        </div>
    );
};

export default MainLayout;