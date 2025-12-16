const express = require('express');
const router = express.Router();
const { createSale, getSales } = require('../controllers/saleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createSale).get(protect, admin, getSales);

module.exports = router;
