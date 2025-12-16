const express = require('express');
const router = express.Router();
const { createQuote, getQuotes, updateQuoteStatus } = require('../controllers/quoteController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createQuote).get(protect, admin, getQuotes);
router.route('/:id/status').put(protect, admin, updateQuoteStatus);

module.exports = router;
