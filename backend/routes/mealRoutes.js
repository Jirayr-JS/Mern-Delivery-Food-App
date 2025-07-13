import express from 'express';
const router = express.Router();
import { getMealById, getMeals } from '../controllers/mealController.js';

router.route('/').get(getMeals);
router.route('/:id').get(getMealById);

export default router;
