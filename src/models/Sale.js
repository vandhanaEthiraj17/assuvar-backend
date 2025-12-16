const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    quoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote',
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // If converted to client user
    },
    clientReference: { // Store name if User not created yet
        type: String,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
    pendingAmount: {
        type: Number,
        required: true, // Should be calculated but stored for query speed
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Sale', saleSchema);
