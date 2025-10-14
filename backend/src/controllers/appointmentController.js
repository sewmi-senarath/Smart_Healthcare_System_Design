import Appointment from '../models/Appointment.js';
import Schedule from '../models/Schedule.js';
import { asyncHandler, AppError } from '../middlewares/errorHandler.js';
import { startOfDay, endOfDay } from 'date-fns';

// @desc    Get appointments
// @route   GET /api/v1/appointments
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
  const { date, status, doctorId, patientId } = req.query;
  
  const filter = {};
  
  if (date) {
    filter.date = {
      $gte: startOfDay(new Date(date)),
      $lte: endOfDay(new Date(date))
    };
  }
  
  if (status) filter.status = status;
  if (doctorId) filter.doctorId = doctorId;
  if (patientId) filter.patientId = patientId;

  const appointments = await Appointment.find(filter)
    .populate('patientId', 'firstName lastName mrn phone')
    .populate('doctorId', 'firstName lastName specialty')
    .sort({ date: 1, time: 1 });

  res.json({
    success: true,
    data: appointments
  });
});

// @desc    Get single appointment
// @route   GET /api/v1/appointments/:id
// @access  Private
export const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patientId')
    .populate('doctorId', 'firstName lastName specialty');

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  res.json({
    success: true,
    data: appointment
  });
});

// @desc    Create appointment
// @route   POST /api/v1/appointments
// @access  Private
export const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, time } = req.body;

  // Check if slot is available
  const existingAppointment = await Appointment.findOne({
    doctorId,
    date,
    time,
    status: { $nin: ['cancelled', 'no-show'] }
  });

  if (existingAppointment) {
    throw new AppError('This time slot is not available', 400);
  }

  const appointment = await Appointment.create(req.body);

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('patientId', 'firstName lastName mrn')
    .populate('doctorId', 'firstName lastName specialty');

  res.status(201).json({
    success: true,
    message: 'Appointment created successfully',
    data: populatedAppointment
  });
});

// @desc    Update appointment
// @route   PATCH /api/v1/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('patientId').populate('doctorId');

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  res.json({
    success: true,
    message: 'Appointment updated successfully',
    data: appointment
  });
});

// @desc    Cancel appointment
// @route   POST /api/v1/appointments/:id/cancel
// @access  Private
export const cancelAppointment = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      status: 'cancelled',
      cancelledBy: req.user.id,
      cancellationReason: reason
    },
    { new: true }
  );

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  res.json({
    success: true,
    message: 'Appointment cancelled successfully',
    data: appointment
  });
});

// @desc    Check-in appointment
// @route   POST /api/v1/appointments/:id/check-in
// @access  Private (Nurse, Doctor)
export const checkInAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      status: 'checked-in',
      checkInTime: new Date()
    },
    { new: true }
  ).populate('patientId').populate('doctorId');

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  res.json({
    success: true,
    message: 'Patient checked in successfully',
    data: appointment
  });
});

// @desc    Get availability for booking
// @route   GET /api/v1/appointments/availability
// @access  Private
export const getAvailability = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    throw new AppError('Doctor ID and date are required', 400);
  }

  // Get doctor's schedule for the date
  const schedule = await Schedule.findOne({
    doctorId,
    'slots.date': new Date(date),
    status: 'published'
  });

  if (!schedule) {
    return res.json({
      success: true,
      data: []
    });
  }

  // Get booked appointments for that day
  const bookedAppointments = await Appointment.find({
    doctorId,
    date: {
      $gte: startOfDay(new Date(date)),
      $lte: endOfDay(new Date(date))
    },
    status: { $nin: ['cancelled', 'no-show'] }
  });

  // Filter available slots
  const availableSlots = schedule.slots
    .filter(slot => slot.date.toDateString() === new Date(date).toDateString())
    .map(slot => {
      const booked = bookedAppointments.filter(apt => apt.time === slot.startTime).length;
      return {
        time: slot.startTime,
        endTime: slot.endTime,
        available: slot.isAvailable && booked < slot.capacity,
        bookedCount: booked,
        capacity: slot.capacity
      };
    });

  res.json({
    success: true,
    data: availableSlots
  });
});
