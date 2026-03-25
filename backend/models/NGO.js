const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Please add an NGO name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        address: {
            type: String,
            required: [true, 'Please add an address'],
        },
        contactEmail: {
            type: String,
            required: [true, 'Please add a contact email'],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        contactPhone: {
            type: String,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        events: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('NGO', ngoSchema);