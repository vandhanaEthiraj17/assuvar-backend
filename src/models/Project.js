const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    saleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'COMPLETED', 'ON_HOLD'],
        default: 'ACTIVE',
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
