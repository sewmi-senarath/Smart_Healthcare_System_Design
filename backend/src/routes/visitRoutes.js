import express from 'express';
import {
  createVisit,
  getVisit,
  updateVisit,
  addTriage,
  addConsultation,
  completeVisit,
  getVisitQueue
} from '../controllers/visitController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.get('/queue', authorize('nurse', 'doctor'), getVisitQueue);

router.post('/', authorize('nurse', 'doctor'), createVisit);
router.get('/:id', getVisit);
router.patch('/:id', authorize('nurse', 'doctor'), updateVisit);
router.post('/:id/triage', authorize('nurse', 'doctor'), addTriage);
router.post('/:id/consultation', authorize('doctor'), addConsultation);
router.post('/:id/complete', authorize('doctor'), completeVisit);

export default router;
