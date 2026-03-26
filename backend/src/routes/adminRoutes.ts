import { Router } from 'express';
import {
  getAllNGORequests,
  verifyNGO,
  getAllUsers,
  deleteUser,
  deleteEventAdmin,
  getStats,
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router: Router = Router();

// All routes are Admin only
router.use(protect, authorize('Admin'));

router.get('/stats', getStats);
router.get('/ngos', getAllNGORequests);
router.put('/ngos/:id/verify', verifyNGO);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.delete('/events/:id', deleteEventAdmin);

export default router;