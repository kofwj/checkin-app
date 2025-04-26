// backend/routes/eventRoutes.js - 活动路由
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);

module.exports = router;
