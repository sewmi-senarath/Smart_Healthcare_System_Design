import express from 'express';
import {
  getPrescriptions,
  getPrescription,
  createPrescription,
  signPrescription,
  dispensePrescription,
  cancelPrescription
} from '../controllers/prescriptionController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validators } from '../middlewares/validator.js';

const router = express.Router();

router.use(protect);

router.get('/:id', getPrescription);
router.post('/:id/sign', authorize('doctor'), signPrescription);
router.post('/:id/dispense', authorize('pharmacist'), dispensePrescription);
router.post('/:id/cancel', authorize('doctor'), cancelPrescription);

router.route('/')
  .get(getPrescriptions)
  .post(authorize('doctor'), validators.createPrescription, createPrescription);

export default router;
