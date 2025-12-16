const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true,
    },
    serviceDescription: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    validityDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['DRAFT', 'SENT', 'ACCEPTED'],
        default: 'DRAFT',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Quote', quoteSchema);
