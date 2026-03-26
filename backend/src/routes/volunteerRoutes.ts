const express = require('express');
const router = express.Router();
const {
    registerForEvent,
    cancelRegistration,
    getMyEvents,
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all events registered by volunteer
router.get(
    '/events',
    protect,
    authorize('Volunteer'),
    getMyEvents
);

module.exports = router;