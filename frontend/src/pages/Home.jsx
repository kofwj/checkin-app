// frontend/src/pages/Home.jsx - 首页，显示所有活动
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { events } from '../services/api';

const Home = () => {
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await events.getAll();
        setEventList(response.data.data);
      } catch (err) {
        setError('获取活动列表失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-2xl font-semibold">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
        {error}
      </div>
    );
  }
return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">活动列表</h1>
      
      {eventList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xl">暂无活动，去创建一个吧！</p>
          <Link 
            to="/create-event"
            className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            创建活动
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventList.map((event) => (
            <div 
              key={event._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>创建者: {event.creator.username}</span>
                  <span>
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Link 
                  to={`/event/${event._id}`}
                  className="block text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  查看详情
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
