const express = require('express');
const router = express.Router();
const {
    getAllNGOs,
    getNGOById,
    createNGO,
    updateNGO,
    deleteNGO,
    getMyNGO,
} = require('../controllers/ngoController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllNGOs);
router.get('/:id', getNGOById);

// Private routes
router.get('/me', protect, authorize('NGO'), getMyNGO);
router.post('/', protect, authorize('NGO'), createNGO);
router.put('/:id', protect, authorize('NGO'), updateNGO);
router.delete('/:id', protect, authorize('Admin'), deleteNGO);

module.exports = router;