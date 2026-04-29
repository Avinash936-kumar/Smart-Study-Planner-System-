const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [200, 'Bio cannot exceed 200 characters'],
    },
    course: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'Course cannot exceed 100 characters'],
    },
    semester: {
      type: String,
      default: '',
      trim: true,
    },
    dailyStudyTarget: {
      type: Number,
      default: 4, // hours
      min: 1,
      max: 16,
    },
    preferredStudyTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night'],
      default: 'evening',
    },
    pomodoroMinutes: {
      type: Number,
      default: 25,
      min: 5,
      max: 60,
    },
    notificationPreferences: {
      dueSoon: { type: Boolean, default: true },
      overdue: { type: Boolean, default: true },
      examCountdown: { type: Boolean, default: true },
      goalReminders: { type: Boolean, default: true },
    },
    // Gamification & Tracking
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{ type: String }],
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
