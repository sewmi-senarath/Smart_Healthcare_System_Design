import User from '../models/User.js';
import { asyncHandler, AppError } from '../middlewares/errorHandler.js';

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Manager, Admin)
export const getUsers = asyncHandler(async (req, res) => {
  const { role, isActive } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PATCH /api/v1/users/:id
// @access  Private (Admin)
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// @desc    Delete user (soft delete)
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get all doctors
// @route   GET /api/v1/users/doctors
// @access  Private
export const getDoctors = asyncHandler(async (req, res) => {
  const { specialty, isActive = true } = req.query;

  const filter = { role: 'doctor', isActive };
  if (specialty) filter.specialty = specialty;

  const doctors = await User.find(filter)
    .select('firstName lastName specialty licenseNumber department')
    .sort({ firstName: 1 });

  res.json({
    success: true,
    data: doctors
  });
});
