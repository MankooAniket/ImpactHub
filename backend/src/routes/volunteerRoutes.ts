import { Router } from 'express';
import { getMyEvents } from '../controllers/volunteerController';
import { protect, authorize } from '../middleware/authMiddleware';

const router: Router = Router();

// Get all events registered by volunteer
router.get(
  '/events',
  protect,
  authorize('Volunteer'),
  getMyEvents
);

export default router;