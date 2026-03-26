const Event = require('../models/Event');
const NGO = require('../models/NGO');

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
    try {
        // Build filter object from query params
        const filter = { status: 'Upcoming' };

        if (req.query.location) {
            filter.location = { $regex: req.query.location, $options: 'i' };
        }

        if (req.query.date) {
            filter.date = { $gte: new Date(req.query.date) };
        }

        const events = await Event.find(filter)
            .populate('ngo', 'name contactEmail')
            .sort({ date: 1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('ngo', 'name description contactEmail address')
            .populate('participants', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private — NGO only
const createEvent = async (req, res) => {
    try {
        // Find the NGO profile of the logged in user
        const ngo = await NGO.findOne({ user: req.user._id });

        if (!ngo) {
            return res.status(404).json({ message: 'NGO profile not found' });
        }

        // Check if NGO is verified
        if (!ngo.verified) {
            return res.status(403).json({ message: 'Your NGO must be verified before posting events' });
        }

        const { title, description, date, time, location } = req.body;

        const event = await Event.create({
            title,
            description,
            ngo: ngo._id,
            date,
            time,
            location,
        });

        // Add event to NGO events array
        ngo.events.push(event._id);
        await ngo.save();

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private — NGO only
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Find NGO profile of logged in user
        const ngo = await NGO.findOne({ user: req.user._id });

        if (!ngo) {
            return res.status(404).json({ message: 'NGO profile not found' });
        }

        // Make sure the NGO owns this event
        if (event.ngo.toString() !== ngo._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: true, runValidators: true }
        );

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private — NGO and Admin
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // If NGO is deleting check ownership
        if (req.user.role === 'NGO') {
            const ngo = await NGO.findOne({ user: req.user._id });

            if (!ngo || event.ngo.toString() !== ngo._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this event' });
            }

            // Remove event from NGO events array
            ngo.events = ngo.events.filter(
                (e) => e.toString() !== event._id.toString()
            );
            await ngo.save();
        }

        await event.deleteOne();
        res.json({ message: 'Event removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};