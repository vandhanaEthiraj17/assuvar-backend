const express = require('express');
const router = express.Router();
const { payEmployee, getPayroll, getExpenses } = require('../controllers/payrollController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/pay', protect, admin, payEmployee);
router.get('/', protect, admin, getPayroll);
router.get('/expenses', protect, admin, getExpenses);

module.exports = router;
