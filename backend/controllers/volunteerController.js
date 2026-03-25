const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private — Volunteer only
const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if event is still upcoming
        if (event.status !== 'Upcoming') {
            return res.status(400).json({
                message: 'Registration is only available for upcoming events',
            });
        }

        // Check if volunteer is already registered
        const alreadyRegistered = event.participants.includes(req.user._id);
        if (alreadyRegistered) {
            return res.status(400).json({
                message: 'You are already registered for this event',
            });
        }

        // Add volunteer to event participants
        event.participants.push(req.user._id);
        await event.save();

        // Add event to volunteer registered events
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { registeredEvents: event._id } },
            { returnDocument: 'after' }
        );

        res.status(201).json({
            message: 'Successfully registered for the event',
            event: {
                _id: event._id,
                title: event.title,
                date: event.date,
                time: event.time,
                location: event.location,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel registration for an event
// @route   DELETE /api/events/:id/register
// @access  Private — Volunteer only
const cancelRegistration = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if volunteer is registered
        const isRegistered = event.participants.includes(req.user._id);
        if (!isRegistered) {
            return res.status(400).json({
                message: 'You are not registered for this event',
            });
        }

        // Remove volunteer from event participants
        event.participants = event.participants.filter(
            (participant) => participant.toString() !== req.user._id.toString()
        );
        await event.save();

        // Remove event from volunteer registered events
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { registeredEvents: event._id } },
            { returnDocument: 'after' }
        );

        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all events registered by logged in volunteer
// @route   GET /api/volunteers/events
// @access  Private — Volunteer only
const getMyEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'registeredEvents',
            populate: {
                path: 'ngo',
                select: 'name contactEmail',
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.registeredEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerForEvent,
    cancelRegistration,
    getMyEvents,
};