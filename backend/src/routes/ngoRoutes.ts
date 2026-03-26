import { Router } from 'express';
import {
  getAllNGOs,
  getNGOById,
  getMyNGO,
  createNGO,
  updateNGO,
  deleteNGO,
} from '../controllers/ngoController';
import { protect, authorize } from '../middleware/authMiddleware';

const router: Router = Router();

// Public routes
router.get('/', getAllNGOs);

// Private routes — must be before /:id to avoid conflict
router.get('/me', protect, authorize('NGO'), getMyNGO);
router.get('/:id', getNGOById);
router.post('/', protect, authorize('NGO'), createNGO);
router.put('/:id', protect, authorize('NGO'), updateNGO);
router.delete('/:id', protect, authorize('Admin'), deleteNGO);

export default router;