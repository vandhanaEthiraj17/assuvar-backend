const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ['PAYROLL', 'OTHER'],
        default: 'OTHER',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    referenceId: { // Link to Payroll ID if applicable
        type: mongoose.Schema.Types.ObjectId,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Expense', expenseSchema);
