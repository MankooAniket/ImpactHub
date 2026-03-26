import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';
import {
  registerForEvent,
  cancelRegistration,
} from '../controllers/volunteerController';
import { protect, authorize } from '../middleware/authMiddleware';

const router: Router = Router();

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

export default router;