const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { catchAsync, ApiError } = require('../middleware/errorHandler');
const { sendEmail } = require('../services/emailService');

/**
 * Generate JWT Token
 */
const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};

/**
 * Send Token Response
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id, user.email, user.role);
  const refreshToken = generateRefreshToken(user._id, user.email, user.role);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message,
    data: {
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        joinDate: user.joinDate,
        totalDownloads: user.totalDownloads,
        monthlyDownloads: user.monthlyDownloads
      }
    }
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError('User with this email already exists', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  // Send welcome email (optional)
  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Islamic Library',
      text: `Welcome ${user.name}! Your account has been created successfully.`
    });
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
    // Don't fail registration if email fails
  }

  sendTokenResponse(user, 201, res, 'User registered successfully');
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Get user with password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ApiError('Invalid email or password', 401));
  }

  // Check if account is active
  if (user.status !== 'active') {
    return next(new ApiError('Account is inactive. Please contact support.', 401));
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new ApiError('Invalid email or password', 401));
  }

  // Update last active
  user.lastActive = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Login successful');
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = catchAsync(async (req, res, next) => {
  // In a more advanced implementation, you might want to blacklist the token
  // For now, we'll just send a success response
  
  res.status(200).json({
    status: 'success',
    message: 'Logout successful'
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = catchAsync(async (req, res, next) => {
  // User is available from auth middleware
  const user = await User.findById(req.user.id)
    .populate('downloadHistory.book', 'title author')
    .select('-password');

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  // Check if email is being changed and if it's already taken
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError('Email already in use', 400));
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    return next(new ApiError('Current password is incorrect', 400));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password changed successfully');
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError('No user found with this email address', 404));
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Islamic Library',
      text: `You are receiving this email because you requested a password reset. Please click the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent'
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ApiError('Email could not be sent', 500));
  }
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
const resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ApiError('Invalid or expired password reset token', 400));
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError('Refresh token is required', 400));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Get user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    if (user.status !== 'active') {
      return next(new ApiError('Account is inactive', 401));
    }

    // Generate new tokens
    const newToken = generateToken(user._id, user.email, user.role);
    const newRefreshToken = generateRefreshToken(user._id, user.email, user.role);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    return next(new ApiError('Invalid refresh token', 401));
  }
});

/**
 * @desc    Verify token
 * @route   GET /api/auth/verify
 * @access  Private
 */
const verifyToken = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Token is valid',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status
      }
    }
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  verifyToken
};