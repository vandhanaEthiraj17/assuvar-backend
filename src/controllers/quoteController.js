const Quote = require('../models/Quote');
const Lead = require('../models/Lead');

// @desc    Create a quote
// @route   POST /api/quotes
// @access  Private/Admin
const createQuote = async (req, res) => {
    const { leadId, serviceDescription, amount, validityDate } = req.body;

    try {
        const quote = await Quote.create({
            leadId,
            serviceDescription,
            amount,
            validityDate,
        });

        // Update Lead status to QUOTED
        await Lead.findByIdAndUpdate(leadId, { status: 'QUOTED' });

        res.status(201).json(quote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Private/Admin
const getQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find({}).populate('leadId', 'name email');
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update quote status (e.g., ACCEPTED)
// @route   PUT /api/quotes/:id/status
// @access  Private/Admin
const updateQuoteStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const quote = await Quote.findById(req.params.id);

        if (quote) {
            quote.status = status;
            await quote.save();
            res.json(quote);
        } else {
            res.status(404).json({ message: 'Quote not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createQuote, getQuotes, updateQuoteStatus };
