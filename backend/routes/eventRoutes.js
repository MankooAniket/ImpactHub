const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Private routes
router.post('/', protect, authorize('NGO'), createEvent);
router.put('/:id', protect, authorize('NGO'), updateEvent);
router.delete('/:id', protect, authorize('NGO', 'Admin'), deleteEvent);

module.exports = router;