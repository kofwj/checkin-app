// frontend/src/components/Navbar.jsx - 导航栏组件
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';

const Navbar = ({ isAuthenticated, setAuth }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    auth.logout();
    setAuth(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">打卡接龙</Link>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <span className="text-white mr-4">欢迎，{user.username}</span>
              <Link to="/create-event" className="text-white mr-4 hover:text-gray-300">创建活动</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4 hover:text-gray-300">登录</Link>
              <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
