import User from '../models/User.js';
import { asyncHandler, AppError } from '../middlewares/errorHandler.js';
import { generateToken } from '../middlewares/auth.js';

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role, phone, specialty, licenseNumber } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    role,
    phone,
    specialty,
    licenseNumber
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar
      },
      token
    }
  });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side by removing the token
  // Optionally, implement token blacklisting here for added security
  
  // Update user's last activity
  await User.findByIdAndUpdate(req.user.id, {
    lastActivity: new Date()
  });
  
  res.json({
    success: true,
    message: 'Logged out successfully. Please clear your session.'
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    avatar: req.body.avatar
  };

  const user = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

// @desc    Change password
// @route   PUT /api/v1/auth/password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Verify current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});
