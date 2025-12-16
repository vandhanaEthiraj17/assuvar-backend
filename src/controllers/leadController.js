const Lead = require('../models/Lead');

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private/Admin
const createLead = async (req, res) => {
    const { name, email, phone, source, notes } = req.body;

    try {
        const lead = await Lead.create({
            name,
            email,
            phone,
            source,
            notes,
        });
        res.status(201).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private/Admin
const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find({});
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update lead status (e.g., QUOTED)
// @route   PUT /api/leads/:id/status
// @access  Private/Admin
const updateLeadStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const lead = await Lead.findById(req.params.id);

        if (lead) {
            lead.status = status;
            const updatedLead = await lead.save();
            res.json(updatedLead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createLead, getLeads, updateLeadStatus };
