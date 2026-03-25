const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');
const {
    registerForEvent,
    cancelRegistration,
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// NGO routes
router.post('/', protect, authorize('NGO'), createEvent);
router.put('/:id', protect, authorize('NGO'), updateEvent);
router.delete('/:id', protect, authorize('NGO', 'Admin'), deleteEvent);

// Volunteer registration routes
router.post('/:id/register', protect, authorize('Volunteer'), registerForEvent);
router.delete('/:id/register', protect, authorize('Volunteer'), cancelRegistration);

module.exports = router;