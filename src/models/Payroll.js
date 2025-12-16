const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    taskId: { // "See completed work" implies link to task
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'PAID'],
        default: 'PENDING',
    },
    paidDate: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Payroll', payrollSchema);
