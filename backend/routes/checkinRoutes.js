// backend/routes/checkinRoutes.js - 打卡路由
const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const { protect } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// 文件过滤器，只允许图片
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('只能上传图片文件'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 限制5MB
});

router.post('/', protect, upload.single('image'), checkinController.createCheckin);
router.get('/event/:eventId', checkinController.getEventCheckins);

module.exports = router;
