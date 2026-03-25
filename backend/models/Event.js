const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add an event title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add an event description'],
        },
        ngo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NGO',
            required: true,
        },
        date: {
            type: Date,
            required: [true, 'Please add an event date'],
        },
        time: {
            type: String,
            required: [true, 'Please add an event time'],
        },
        location: {
            type: String,
            required: [true, 'Please add an event location'],
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        status: {
            type: String,
            enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
            default: 'Upcoming',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Event', eventSchema);