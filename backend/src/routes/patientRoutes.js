import express from 'express';
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients,
  getPatientHistory
} from '../controllers/patientController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validators } from '../middlewares/validator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/search', searchPatients);
router.get('/:id/history', getPatientHistory);

router.route('/')
  .get(getPatients)
  .post(authorize('nurse', 'doctor', 'admin'), validators.createPatient, createPatient);

router.route('/:id')
  .get(getPatient)
  .put(authorize('nurse', 'doctor', 'admin'), updatePatient)
  .delete(authorize('admin'), deletePatient);

export default router;
