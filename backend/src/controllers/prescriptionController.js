import Prescription from '../models/Prescription.js';
import { asyncHandler, AppError } from '../middlewares/errorHandler.js';

// @desc    Get prescriptions
// @route   GET /api/v1/prescriptions
// @access  Private
export const getPrescriptions = asyncHandler(async (req, res) => {
  const { patientId, doctorId, status } = req.query;

  const filter = {};
  if (patientId) filter.patientId = patientId;
  if (doctorId) filter.doctorId = doctorId;
  if (status) filter.status = status;

  // Pharmacists see only signed prescriptions
  if (req.user.role === 'pharmacist') {
    filter.status = { $in: ['signed', 'sent-to-pharmacy', 'dispensed'] };
  }

  const prescriptions = await Prescription.find(filter)
    .populate('patientId', 'firstName lastName mrn allergies')
    .populate('doctorId', 'firstName lastName specialty')
    .populate('dispensedBy', 'firstName lastName')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: prescriptions
  });
});

// @desc    Get prescription by ID
// @route   GET /api/v1/prescriptions/:id
// @access  Private
export const getPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findOne({
    $or: [
      { _id: req.params.id },
      { prescriptionId: req.params.id }
    ]
  })
    .populate('patientId')
    .populate('doctorId', 'firstName lastName specialty licenseNumber')
    .populate('dispensedBy', 'firstName lastName');

  if (!prescription) {
    throw new AppError('Prescription not found', 404);
  }

  res.json({
    success: true,
    data: prescription
  });
});

// @desc    Create prescription
// @route   POST /api/v1/prescriptions
// @access  Private (Doctor)
export const createPrescription = asyncHandler(async (req, res) => {
  const { patientId, visitId, medications, notes } = req.body;

  const prescription = await Prescription.create({
    patientId,
    doctorId: req.user.id,
    visitId,
    medications,
    notes,
    status: 'draft'
  });

  const populatedPrescription = await Prescription.findById(prescription._id)
    .populate('patientId', 'firstName lastName mrn allergies')
    .populate('doctorId', 'firstName lastName specialty');

  res.status(201).json({
    success: true,
    message: 'Prescription created successfully',
    data: populatedPrescription
  });
});

// @desc    Sign prescription
// @route   POST /api/v1/prescriptions/:id/sign
// @access  Private (Doctor)
export const signPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    throw new AppError('Prescription not found', 404);
  }

  if (prescription.doctorId.toString() !== req.user.id) {
    throw new AppError('You can only sign your own prescriptions', 403);
  }

  if (prescription.status !== 'draft') {
    throw new AppError('Prescription has already been signed', 400);
  }

  prescription.status = 'signed';
  prescription.signedAt = new Date();

  await prescription.save();

  res.json({
    success: true,
    message: 'Prescription signed successfully',
    data: prescription
  });
});

// @desc    Dispense prescription
// @route   POST /api/v1/prescriptions/:id/dispense
// @access  Private (Pharmacist)
export const dispensePrescription = asyncHandler(async (req, res) => {
  const { dispenseStatus, dispenseNotes, counselingChecklist } = req.body;

  const prescription = await Prescription.findOne({
    $or: [
      { _id: req.params.id },
      { prescriptionId: req.params.id }
    ]
  });

  if (!prescription) {
    throw new AppError('Prescription not found', 404);
  }

  if (prescription.status !== 'signed' && prescription.status !== 'sent-to-pharmacy') {
    throw new AppError('Prescription must be signed before dispensing', 400);
  }

  // Check if prescription is expired
  if (prescription.expiryDate && new Date() > prescription.expiryDate) {
    throw new AppError('Prescription has expired', 400);
  }

  prescription.status = 'dispensed';
  prescription.dispensedAt = new Date();
  prescription.dispensedBy = req.user.id;
  prescription.dispenseStatus = dispenseStatus;
  prescription.dispenseNotes = dispenseNotes;
  prescription.counselingChecklist = counselingChecklist;

  await prescription.save();

  const populatedPrescription = await Prescription.findById(prescription._id)
    .populate('patientId', 'firstName lastName mrn')
    .populate('doctorId', 'firstName lastName')
    .populate('dispensedBy', 'firstName lastName');

  res.json({
    success: true,
    message: 'Prescription dispensed successfully',
    data: populatedPrescription
  });
});

// @desc    Cancel prescription
// @route   POST /api/v1/prescriptions/:id/cancel
// @access  Private (Doctor)
export const cancelPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    throw new AppError('Prescription not found', 404);
  }

  if (prescription.doctorId.toString() !== req.user.id) {
    throw new AppError('You can only cancel your own prescriptions', 403);
  }

  if (prescription.status === 'dispensed') {
    throw new AppError('Cannot cancel a dispensed prescription', 400);
  }

  prescription.status = 'cancelled';
  await prescription.save();

  res.json({
    success: true,
    message: 'Prescription cancelled successfully',
    data: prescription
  });
});
