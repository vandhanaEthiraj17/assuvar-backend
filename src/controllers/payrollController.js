const Payroll = require('../models/Payroll');
const Expense = require('../models/Expense');
const Task = require('../models/Task');

// @desc    Create Payroll (Mark Task for Payment) or just mark valid
//          Prompt says: "Admin can See completed work, See agreed salary, Mark payroll as PAID"
//          This implies the Payroll record might be created *when* work is completed or manually.
//          Let's assume Admin manually creates the payroll entry or approves the task salary for payment.
//          Simplest flow: Admin lists completed tasks -> Clicks "Pay" -> Creates Payroll(PAID) + Expense.

// @desc    Pay Employee for Task
// @route   POST /api/payroll/pay
// @access  Private/Admin
const payEmployee = async (req, res) => {
    const { taskId, amount } = req.body; // Amount should verify vs Task salary

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if double paying
        const exists = await Payroll.findOne({ taskId });
        if (exists) {
            return res.status(400).json({ message: 'Payroll already processed for this task' });
        }

        const payroll = await Payroll.create({
            employeeId: task.employeeId,
            taskId,
            amount: amount || task.salary,
            status: 'PAID',
            paidDate: new Date(),
        });

        // Create Expense Record
        await Expense.create({
            description: `Payroll for Task: ${task.name}`,
            amount: payroll.amount,
            category: 'PAYROLL',
            referenceId: payroll._id,
        });

        res.status(201).json(payroll);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Payroll History
// @route   GET /api/payroll
// @access  Private/Admin
const getPayroll = async (req, res) => {
    try {
        const payrolls = await Payroll.find({}).populate('employeeId', 'name').populate('taskId', 'name');
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Expenses (includes Payroll)
// @route   GET /api/expenses
// @access  Private/Admin
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({});
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { payEmployee, getPayroll, getExpenses };
