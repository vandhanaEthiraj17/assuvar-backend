const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['NEW', 'QUOTED', 'SOLD'],
        default: 'NEW',
    },
    notes: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Lead', leadSchema);
