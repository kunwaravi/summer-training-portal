import { Router } from 'express';
import { curriculum } from '../lib/curriculumData';

const router = Router();

// GET /api/courses - returns full rich curriculum data
router.get('/', (req, res) => {
  res.json(curriculum);
});

export default router;
