const express = require('express');
const { getBudget, updateLimit, addExpense, deleteExpense } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.get('/', getBudget);
router.put('/:id/limit', updateLimit);
router.post('/:id/expense', addExpense);
router.delete('/:id/expense/:expenseId', deleteExpense);

module.exports = router;
