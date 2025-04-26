// frontend/src/pages/EventDetail.jsx - 活动详情页面
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { events, checkins } from '../services/api';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [checkinList, setCheckinList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    content: '',
    image: null
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // 获取活动和打卡数据
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await events.getOne(id);
        setEvent(eventResponse.data.data);
        
        const checkinsResponse = await checkins.getByEvent(id);
        setCheckinList(checkinsResponse.data.data);
      } catch (err) {
        setError('获取数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // 预览图片
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, image: null });
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content && !formData.image) {
      return setError('请填写内容或上传图片');
    }
    
    try {
      setSubmitLoading(true);
      const response = await checkins.create({
        eventId: id,
        content: formData.content,
        image: formData.image
      });
      
      // 添加新打卡到列表前端
      setCheckinList([response.data.data, ...checkinList]);
      
      // 重置表单
      setFormData({
        content: '',
        image: null
      });
      setPreviewUrl('');
      document.getElementById('image-upload').value = '';
      
    } catch (err) {
      setError(err.response?.data?.message || '打卡失败，请稍后再试');
    } finally {
      setSubmitLoading(false);
    }
  };

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

  // 检查活动是否已结束
  const isEventEnded = event.endDate && new Date(event.endDate) < new Date();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 活动信息 */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        {event.description && (
          <p className="text-gray-700 mb-4">{event.description}</p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>创建者: {event.creator.username}</span>
          <div>
            <div>创建时间: {new Date(event.createdAt).toLocaleString()}</div>
            {event.endDate && (
              <div className={isEventEnded ? 'text-red-500' : ''}>
                结束时间: {new Date(event.endDate).toLocaleString()}
                {isEventEnded && ' (已结束)'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 打卡表单 */}
      {!isEventEnded && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">我要打卡</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                打卡内容
              </label>
              <textarea
                id="content"
                name="content"
                rows="3"
                value={formData.content}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
                上传图片
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              
              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="预览"
                    className="h-40 object-contain"
                  />
                </div>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={submitLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {submitLoading ? '提交中...' : '提交打卡'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* 打卡列表 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">打卡记录 ({checkinList.length})</h2>
        
        {checkinList.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">暂无打卡记录，快来成为第一个打卡的人吧！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {checkinList.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-medium">{item.user.username}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
                
                {item.content && (
                  <p className="text-gray-700 mb-4 whitespace-pre-line">{item.content}</p>
                )}
                
                {item.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={`http://localhost:5000${item.imageUrl}`}
                      alt="打卡图片"
                      className="max-h-96 object-contain rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
