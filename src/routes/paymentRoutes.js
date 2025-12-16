const express = require('express');
const router = express.Router();
const { recordPayment, paymentWebhook, getPayments } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, recordPayment)
    .get(protect, admin, getPayments);

router.post('/webhook', paymentWebhook);

module.exports = router;
