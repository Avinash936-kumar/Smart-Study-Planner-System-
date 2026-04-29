const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['food', 'travel', 'books', 'hostel', 'entertainment', 'other'], 
    default: 'other' 
  },
  date: { type: Date, default: Date.now }
});

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    month: { type: String, required: true }, // Format: "YYYY-MM"
    monthlyLimit: { type: Number, required: true, min: 1 },
    expenses: [expenseSchema],
  },
  { timestamps: true }
);

// Virtual for calculating total spent
budgetSchema.virtual('totalSpent').get(function () {
  return this.expenses.reduce((total, exp) => total + exp.amount, 0);
});

// Virtual for remaining balance
budgetSchema.virtual('remainingBalance').get(function () {
  return this.monthlyLimit - this.totalSpent;
});

budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
