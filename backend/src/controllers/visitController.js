import Visit from '../models/Visit.js';
import { asyncHandler, AppError } from '../middlewares/errorHandler.js';

// @desc    Create new visit
// @route   POST /api/v1/visits
// @access  Private (Nurse, Doctor)
export const createVisit = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, type } = req.body;

  const visit = await Visit.create({
    patientId,
    appointmentId,
    type,
    checkInBy: req.user.id,
    checkInTime: new Date(),
    status: 'checked-in'
  });

  const populatedVisit = await Visit.findById(visit._id)
    .populate('patientId', 'firstName lastName mrn')
    .populate('checkInBy', 'firstName lastName');

  res.status(201).json({
    success: true,
    message: 'Visit created successfully',
    data: populatedVisit
  });
});

// @desc    Get visit by ID
// @route   GET /api/v1/visits/:id
// @access  Private
export const getVisit = asyncHandler(async (req, res) => {
  const visit = await Visit.findById(req.params.id)
    .populate('patientId')
    .populate('checkInBy', 'firstName lastName')
    .populate('triage.recordedBy', 'firstName lastName')
    .populate('consultation.doctorId', 'firstName lastName specialty');

  if (!visit) {
    throw new AppError('Visit not found', 404);
  }

  res.json({
    success: true,
    data: visit
  });
});

// @desc    Update visit
// @route   PATCH /api/v1/visits/:id
// @access  Private (Nurse, Doctor)
export const updateVisit = asyncHandler(async (req, res) => {
  const visit = await Visit.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('patientId');

  if (!visit) {
    throw new AppError('Visit not found', 404);
  }

  res.json({
    success: true,
    message: 'Visit updated successfully',
    data: visit
  });
});

// @desc    Add triage data
// @route   POST /api/v1/visits/:id/triage
// @access  Private (Nurse, Doctor)
export const addTriage = asyncHandler(async (req, res) => {
  const { vitals, notes, attachments } = req.body;

  const visit = await Visit.findById(req.params.id);

  if (!visit) {
    throw new AppError('Visit not found', 404);
  }

  visit.triage = {
    recordedBy: req.user.id,
    recordedAt: new Date(),
    vitals,
    notes,
    attachments
  };
  visit.status = 'triaged';

  await visit.save();

  const populatedVisit = await Visit.findById(visit._id)
    .populate('patientId')
    .populate('triage.recordedBy', 'firstName lastName');

  res.json({
    success: true,
    message: 'Triage data recorded successfully',
    data: populatedVisit
  });
});

// @desc    Add consultation data
// @route   POST /api/v1/visits/:id/consultation
// @access  Private (Doctor)
export const addConsultation = asyncHandler(async (req, res) => {
  const { soapNotes, diagnoses, procedures, orders } = req.body;

  const visit = await Visit.findById(req.params.id);

  if (!visit) {
    throw new AppError('Visit not found', 404);
  }

  visit.consultation = {
    doctorId: req.user.id,
    startTime: visit.consultation?.startTime || new Date(),
    endTime: new Date(),
    soapNotes,
    diagnoses,
    procedures,
    orders
  };
  visit.status = 'in-consultation';

  await visit.save();

  const populatedVisit = await Visit.findById(visit._id)
    .populate('patientId')
    .populate('consultation.doctorId', 'firstName lastName specialty');

  res.json({
    success: true,
    message: 'Consultation data recorded successfully',
    data: populatedVisit
  });
});

// @desc    Complete visit
// @route   POST /api/v1/visits/:id/complete
// @access  Private (Doctor)
export const completeVisit = asyncHandler(async (req, res) => {
  const visit = await Visit.findById(req.params.id);

  if (!visit) {
    throw new AppError('Visit not found', 404);
  }

  visit.status = 'completed';
  visit.checkOutTime = new Date();

  await visit.save();

  res.json({
    success: true,
    message: 'Visit completed successfully',
    data: visit
  });
});

// @desc    Get visit queue
// @route   GET /api/v1/visits/queue
// @access  Private (Nurse, Doctor)
export const getVisitQueue = asyncHandler(async (req, res) => {
  const visits = await Visit.find({
    status: { $in: ['checked-in', 'triaged', 'in-consultation'] },
    checkInTime: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0))
    }
  })
    .populate('patientId', 'firstName lastName mrn age')
    .populate('consultation.doctorId', 'firstName lastName')
    .sort({ checkInTime: 1 });

  res.json({
    success: true,
    data: visits
  });
});
