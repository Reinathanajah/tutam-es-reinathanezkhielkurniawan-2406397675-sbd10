import express from 'express';
import {
  createEntry,
  getOwnEntries,
  getPublicDiaries,
  updateEntry,
  deleteEntry,
  addComment
} from '../controllers/entryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createEntry);
router.get('/me', getOwnEntries);
router.get('/public', getPublicDiaries);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);
router.post('/:id/comment', addComment);

export default router;
