import Schedule from '../models/Schedule.js';
import { asyncHandler, AppError } from '../middlewares/errorHandler.js';
import { startOfWeek, endOfWeek, addDays } from 'date-fns';

// @desc    Get schedules
// @route   GET /api/v1/schedules
// @access  Private (Manager, Admin)
export const getSchedules = asyncHandler(async (req, res) => {
  const { doctorId, status } = req.query;

  const filter = {};
  if (doctorId) filter.doctorId = doctorId;
  if (status) filter.status = status;

  const schedules = await Schedule.find(filter)
    .populate('doctorId', 'firstName lastName specialty')
    .populate('publishedBy', 'firstName lastName')
    .sort({ weekStartDate: -1 });

  res.json({
    success: true,
    data: schedules
  });
});

// @desc    Get single schedule
// @route   GET /api/v1/schedules/:id
// @access  Private
export const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id)
    .populate('doctorId', 'firstName lastName specialty');

  if (!schedule) {
    throw new AppError('Schedule not found', 404);
  }

  res.json({
    success: true,
    data: schedule
  });
});

// @desc    Create schedule
// @route   POST /api/v1/schedules
// @access  Private (Manager, Admin)
export const createSchedule = asyncHandler(async (req, res) => {
  const { doctorId, weekStartDate, slots } = req.body;

  const weekStart = startOfWeek(new Date(weekStartDate), { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 }); // Sunday

  // Check if schedule already exists for this week
  const existingSchedule = await Schedule.findOne({
    doctorId,
    weekStartDate: { $gte: weekStart, $lte: weekEnd }
  });

  if (existingSchedule) {
    throw new AppError('Schedule already exists for this week', 400);
  }

  const schedule = await Schedule.create({
    doctorId,
    weekStartDate: weekStart,
    weekEndDate: weekEnd,
    slots,
    status: 'draft'
  });

  const populatedSchedule = await Schedule.findById(schedule._id)
    .populate('doctorId', 'firstName lastName specialty');

  res.status(201).json({
    success: true,
    message: 'Schedule created successfully',
    data: populatedSchedule
  });
});

// @desc    Update schedule
// @route   PATCH /api/v1/schedules/:id
// @access  Private (Manager, Admin)
export const updateSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    throw new AppError('Schedule not found', 404);
  }

  if (schedule.status === 'published') {
    throw new AppError('Cannot modify published schedule', 400);
  }

  Object.assign(schedule, req.body);
  await schedule.save();

  res.json({
    success: true,
    message: 'Schedule updated successfully',
    data: schedule
  });
});

// @desc    Publish schedule
// @route   POST /api/v1/schedules/:id/publish
// @access  Private (Manager, Admin)
export const publishSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    throw new AppError('Schedule not found', 404);
  }

  if (schedule.status === 'published') {
    throw new AppError('Schedule is already published', 400);
  }

  // Check for unresolved conflicts
  const unresolvedConflicts = schedule.conflicts.filter(c => !c.resolved);
  if (unresolvedConflicts.length > 0) {
    throw new AppError('Cannot publish schedule with unresolved conflicts', 400);
  }

  schedule.status = 'published';
  schedule.publishedAt = new Date();
  schedule.publishedBy = req.user.id;

  await schedule.save();

  // TODO: Send notifications to staff

  res.json({
    success: true,
    message: 'Schedule published successfully',
    data: schedule
  });
});

// @desc    Get weekly schedule
// @route   GET /api/v1/schedules/week
// @access  Private
export const getWeeklySchedule = asyncHandler(async (req, res) => {
  const { startDate } = req.query;

  const weekStart = startDate 
    ? startOfWeek(new Date(startDate), { weekStartsOn: 1 })
    : startOfWeek(new Date(), { weekStartsOn: 1 });
  
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

  const schedules = await Schedule.find({
    weekStartDate: { $gte: weekStart, $lte: weekEnd },
    status: 'published'
  }).populate('doctorId', 'firstName lastName specialty');

  res.json({
    success: true,
    data: {
      weekStart,
      weekEnd,
      schedules
    }
  });
});
