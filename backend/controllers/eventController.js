// backend/controllers/eventController.js - 活动控制器
const Event = require('../models/event');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, endDate } = req.body;
    
    const event = await Event.create({
      title,
      description,
      creator: req.user._id,
      endDate: endDate || null
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .populate('creator', 'username');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'username');

    if (!event) {
      return res.status(404).json({ message: '未找到该活动' });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
