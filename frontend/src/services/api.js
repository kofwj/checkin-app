// frontend/src/services/api.js - API服务
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器，添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 认证相关API
export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// 活动相关API
export const events = {
  create: (eventData) => api.post('/events', eventData),
  getAll: () => api.get('/events'),
  getOne: (id) => api.get(`/events/${id}`)
};

// 打卡相关API
export const checkins = {
  create: (checkinData) => {
    const formData = new FormData();
    if (checkinData.image) {
      formData.append('image', checkinData.image);
    }
    formData.append('eventId', checkinData.eventId);
    formData.append('content', checkinData.content);
    
    return api.post('/checkins', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getByEvent: (eventId) => api.get(`/checkins/event/${eventId}`)
};

export default api;
