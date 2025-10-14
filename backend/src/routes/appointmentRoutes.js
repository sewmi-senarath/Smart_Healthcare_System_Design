import express from 'express';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  checkInAppointment,
  getAvailability
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validators } from '../middlewares/validator.js';

const router = express.Router();

router.use(protect);

router.get('/availability', getAvailability);
router.post('/:id/check-in', authorize('nurse', 'doctor'), checkInAppointment);
router.post('/:id/cancel', cancelAppointment);

router.route('/')
  .get(getAppointments)
  .post(validators.createAppointment, createAppointment);

router.route('/:id')
  .get(getAppointment)
  .patch(updateAppointment);

export default router;
