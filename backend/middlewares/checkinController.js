// backend/controllers/checkinController.js - 打卡控制器
const Checkin = require('../models/checkin');
const Event = require('../models/event');
const path = require('path');
const fs = require('fs');

exports.createCheckin = async (req, res) => {
  try {
    const { eventId, content } = req.body;
    
    // 检查活动是否存在
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: '未找到该活动' });
    }
    
    // 检查活动是否已结束
    if (event.endDate && new Date(event.endDate) < new Date()) {
      return res.status(400).json({ message: '该活动已结束' });
    }

    // 处理图片上传
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const checkin = await Checkin.create({
      event: eventId,
      user: req.user._id,
      content,
      imageUrl
    });

    await checkin.populate('user', 'username');

    res.status(201).json({
      success: true,
      data: checkin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEventCheckins = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const checkins = await Checkin.find({ event: eventId })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatarUrl');

    res.status(200).json({
      success: true,
      count: checkins.length,
      data: checkins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
