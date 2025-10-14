import express from 'express';
import {
  getPatientDashboard,
  getPatientMedicalRecords,
  getPatientPrescriptions
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Patient dashboard routes
router.get('/patient', authorize('patient'), getPatientDashboard);
router.get('/patient/medical-records', authorize('patient'), getPatientMedicalRecords);
router.get('/patient/prescriptions', authorize('patient'), getPatientPrescriptions);

export default router;
