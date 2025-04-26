// backend/app.js - Express应用入口
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 路由
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const checkinRoutes = require('./routes/checkinRoutes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置静态文件夹
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 确保上传目录存在
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/checkins', checkinRoutes);

// 连接数据库
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('数据库连接成功'))
.catch(err => console.log('数据库连接失败:', err));

// 错误处理
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`服务器运行在端口: ${PORT}`));

module.exports = app;
