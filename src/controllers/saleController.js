const Sale = require('../models/Sale');
const Quote = require('../models/Quote');
const Lead = require('../models/Lead');

// @desc    Convert Quote to Sale
// @route   POST /api/sales
// @access  Private/Admin
const createSale = async (req, res) => {
    const { quoteId, clientReference } = req.body;

    try {
        const quote = await Quote.findById(quoteId);

        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }

        if (quote.status !== 'ACCEPTED') {
            return res.status(400).json({ message: 'Quote must be accepted before converting to sale' });
        }

        // Check if sale already exists for this quote
        const saleExists = await Sale.findOne({ quoteId });
        if (saleExists) {
            return res.status(400).json({ message: 'Sale already exists for this quote' });
        }

        const sale = await Sale.create({
            quoteId,
            clientReference,
            totalAmount: quote.amount,
            pendingAmount: quote.amount, // Initially full amount pending
        });

        // Update Lead status to SOLD
        // Find lead via quote
        await Lead.findByIdAndUpdate(quote.leadId, { status: 'SOLD' });

        res.status(201).json(sale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private/Admin
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find({}).populate({
            path: 'quoteId',
            populate: { path: 'leadId', select: 'name email' }
        });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSale, getSales };
