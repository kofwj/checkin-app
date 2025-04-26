// frontend/src/App.js - 应用入口
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 组件导入
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import EventDetail from './pages/EventDetail';

// 路由保护组件
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // 检查本地存储中是否有token
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar isAuthenticated={isAuthenticated} setAuth={setIsAuthenticated} />
        <div className="py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/" /> : <Register setAuth={setIsAuthenticated} />} 
            />
            <Route 
              path="/create-event" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreateEvent />
                </ProtectedRoute>
              } 
            />
            <Route path="/event/:id" element={<EventDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
