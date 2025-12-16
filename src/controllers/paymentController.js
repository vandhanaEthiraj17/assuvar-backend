const Payment = require('../models/Payment');
const Sale = require('../models/Sale');

// @desc    Record a manual payment or generic payment
// @route   POST /api/payments
// @access  Private/Admin
const recordPayment = async (req, res) => {
    const { saleId, amount, method, transactionId, status } = req.body;

    try {
        const sale = await Sale.findById(saleId);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        const payment = await Payment.create({
            saleId,
            amount,
            method,
            transactionId,
            status: status || 'SUCCESS',
        });

        if (payment.status === 'SUCCESS') {
            sale.paidAmount += Number(amount);
            sale.pendingAmount = sale.totalAmount - sale.paidAmount;
            await sale.save();
        }

        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Handle Webhook (Razorpay/Stripe placeholder)
// @route   POST /api/payments/webhook
// @access  Public
const paymentWebhook = async (req, res) => {
    // Logic here would depend on the provider signature verification
    console.log('Webhook Received:', req.body);
    res.json({ status: 'received' });
};

// @desc    Get payments
// @route   GET /api/payments
// @access  Private/Admin
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({}).populate('saleId');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { recordPayment, paymentWebhook, getPayments };
