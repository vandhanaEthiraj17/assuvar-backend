const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    saleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    method: {
        type: String,
        enum: ['RAZORPAY', 'STRIPE', 'MANUAL', 'BANK_TRANSFER'],
        default: 'MANUAL',
    },
    transactionId: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'SUCCESS',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
