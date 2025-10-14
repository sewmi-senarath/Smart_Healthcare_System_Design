import express from 'express';
import {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  publishSchedule,
  getWeeklySchedule
} from '../controllers/scheduleController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.get('/week', getWeeklySchedule);
router.post('/:id/publish', authorize('manager', 'admin'), publishSchedule);

router.route('/')
  .get(authorize('manager', 'admin'), getSchedules)
  .post(authorize('manager', 'admin'), createSchedule);

router.route('/:id')
  .get(getSchedule)
  .patch(authorize('manager', 'admin'), updateSchedule);

export default router;
