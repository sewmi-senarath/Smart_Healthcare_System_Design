import { body, param, query, validationResult } from 'express-validator';

// Validation result handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Common validators
export const validators = {
  // User validators
  register: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('role').isIn(['patient', 'nurse', 'doctor', 'manager', 'pharmacist']).withMessage('Invalid role'),
    validate
  ],

  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],

  // Patient validators
  createPatient: [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('phone').isMobilePhone().withMessage('Valid phone number is required'),
    validate
  ],

  // Appointment validators
  createAppointment: [
    body('patientId').isMongoId().withMessage('Valid patient ID is required'),
    body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required'),
    body('reason').trim().notEmpty().withMessage('Reason for visit is required'),
    validate
  ],

  // Prescription validators
  createPrescription: [
    body('patientId').isMongoId().withMessage('Valid patient ID is required'),
    body('medications').isArray({ min: 1 }).withMessage('At least one medication is required'),
    body('medications.*.name').trim().notEmpty().withMessage('Medication name is required'),
    body('medications.*.dosage').trim().notEmpty().withMessage('Dosage is required'),
    body('medications.*.frequency').trim().notEmpty().withMessage('Frequency is required'),
    validate
  ],

  // ID parameter validator
  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
    validate
  ]
};
