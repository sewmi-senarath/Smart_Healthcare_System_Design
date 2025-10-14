import Patient from '../models/Patient.js';
import Visit from '../models/Visit.js';
import Appointment from '../models/Appointment.js';
import { asyncHandler, AppError } from '../middlewares/errorHandler.js';

// @desc    Get all patients
// @route   GET /api/v1/patients
// @access  Private
export const getPatients = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const patients = await Patient.find({ isActive: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Patient.countDocuments({ isActive: true });

  res.json({
    success: true,
    data: patients,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single patient
// @route   GET /api/v1/patients/:id
// @access  Private
export const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.json({
    success: true,
    data: patient
  });
});

// @desc    Create new patient
// @route   POST /api/v1/patients
// @access  Private (Nurse, Doctor, Admin)
export const createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Patient created successfully',
    data: patient
  });
});

// @desc    Update patient
// @route   PUT /api/v1/patients/:id
// @access  Private (Nurse, Doctor, Admin)
export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.json({
    success: true,
    message: 'Patient updated successfully',
    data: patient
  });
});

// @desc    Delete patient (soft delete)
// @route   DELETE /api/v1/patients/:id
// @access  Private (Admin only)
export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.json({
    success: true,
    message: 'Patient deleted successfully'
  });
});

// @desc    Search patients
// @route   GET /api/v1/patients/search
// @access  Private
export const searchPatients = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new AppError('Search query is required', 400);
  }

  const patients = await Patient.find({
    isActive: true,
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { mrn: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ]
  }).limit(10);

  res.json({
    success: true,
    data: patients
  });
});

// @desc    Get patient history
// @route   GET /api/v1/patients/:id/history
// @access  Private
export const getPatientHistory = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  // Get visits
  const visits = await Visit.find({ patientId: req.params.id })
    .populate('consultation.doctorId', 'firstName lastName specialty')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get appointments
  const appointments = await Appointment.find({ patientId: req.params.id })
    .populate('doctorId', 'firstName lastName specialty')
    .sort({ date: -1 })
    .limit(10);

  res.json({
    success: true,
    data: {
      patient,
      visits,
      appointments
    }
  });
});
