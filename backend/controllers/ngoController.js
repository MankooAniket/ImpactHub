const NGO = require('../models/NGO');

// @desc    Get all verified NGOs
// @route   GET /api/ngos
// @access  Public
const getAllNGOs = async (req, res) => {
    try {
        const ngos = await NGO.find({ verified: true }).populate('user', 'name email');
        res.json(ngos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single NGO by ID
// @route   GET /api/ngos/:id
// @access  Public
const getNGOById = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id)
            .populate('user', 'name email')
            .populate('events');

        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        res.json(ngo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create NGO profile
// @route   POST /api/ngos
// @access  Private — NGO only
const createNGO = async (req, res) => {
    try {
        // Check if NGO profile already exists for this user
        const existingNGO = await NGO.findOne({ user: req.user._id });
        if (existingNGO) {
            return res.status(400).json({ message: 'NGO profile already exists for this user' });
        }

        const { name, description, address, contactEmail, contactPhone } = req.body;

        const ngo = await NGO.create({
            user: req.user._id,
            name,
            description,
            address,
            contactEmail,
            contactPhone,
        });

        res.status(201).json(ngo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update NGO profile
// @route   PUT /api/ngos/:id
// @access  Private — NGO only
const updateNGO = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id);

        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        // Make sure the logged in user owns this NGO profile
        if (ngo.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this NGO profile' });
        }

        const updatedNGO = await NGO.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedNGO);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete NGO profile
// @route   DELETE /api/ngos/:id
// @access  Private — Admin only
const deleteNGO = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id);

        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        await ngo.deleteOne();
        res.json({ message: 'NGO profile removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get NGO profile of logged in NGO user
// @route   GET /api/ngos/me
// @access  Private — NGO only
const getMyNGO = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user._id }).populate('events');

        if (!ngo) {
            return res.status(404).json({ message: 'NGO profile not found' });
        }

        res.json(ngo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllNGOs,
    getNGOById,
    createNGO,
    updateNGO,
    deleteNGO,
    getMyNGO,
};