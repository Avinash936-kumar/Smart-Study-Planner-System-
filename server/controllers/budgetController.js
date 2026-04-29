const Budget = require('../models/Budget');

exports.getBudget = async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    if (!month) return res.status(400).json({ success: false, message: 'Month required' });
    
    let budget = await Budget.findOne({ userId: req.user._id, month });
    if (!budget) {
      // Create default if not exists
      budget = await Budget.create({ userId: req.user._id, month, monthlyLimit: 5000, expenses: [] });
    }
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateLimit = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { monthlyLimit: req.body.monthlyLimit },
      { new: true }
    );
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });
    if (!budget) return res.status(404).json({ success: false, message: 'Not found' });

    budget.expenses.push(req.body);
    await budget.save();
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });
    if (!budget) return res.status(404).json({ success: false, message: 'Not found' });

    budget.expenses = budget.expenses.filter(e => e._id.toString() !== req.params.expenseId);
    await budget.save();
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
