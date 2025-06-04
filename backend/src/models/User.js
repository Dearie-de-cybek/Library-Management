const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // Download statistics
  totalDownloads: {
    type: Number,
    default: 0
  },
  monthlyDownloads: {
    type: Number,
    default: 0
  },
  favoriteCategory: {
    type: String,
    default: ''
  },
  
  // Download history (last 10 downloads for quick access)
  downloadHistory: {
    type: [{
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      },
      downloadDate: {
        type: Date,
        default: Date.now
      },
      bookTitle: String // Denormalized for performance
    }],
    default: [] // Fixed: Ensure it's always an array
  },
  
  // Recent downloads for admin view (last 5)
  recentDownloads: {
    type: [{
      bookTitle: String,
      date: String // Formatted date string
    }],
    default: [] // Fixed: Ensure it's always an array
  },
  
  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date

}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ totalDownloads: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Instance method to generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const crypto = require('crypto');
  
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

// Static method to get user stats
userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        },
        totalDownloads: { $sum: '$totalDownloads' },
        avgDownloadsPerUser: { $avg: '$totalDownloads' }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    totalDownloads: 0,
    avgDownloadsPerUser: 0
  };
};

// Update last active date before any find operation
userSchema.pre(/^find/, function() {
  // Don't update lastActive for admin queries
  if (this.getOptions().skipLastActiveUpdate) {
    return;
  }
  
  // Update lastActive for the current user
  if (this.getQuery()._id) {
    this.updateOne({}, { lastActive: new Date() });
  }
});

// Virtual for user's download count this month - FIXED
userSchema.virtual('currentMonthDownloads').get(function() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Fixed: Add null check to prevent filter error
  if (!this.downloadHistory || !Array.isArray(this.downloadHistory)) {
    return 0;
  }
  
  return this.downloadHistory.filter(download => 
    download.downloadDate >= startOfMonth
  ).length;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);