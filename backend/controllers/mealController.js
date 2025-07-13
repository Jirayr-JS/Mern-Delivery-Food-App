import asyncHandler from '../middleware/asyncHandler.js';
import Meal from '../models/mealModel.js';

// @desc    Fetch all meals
// @route   GET /api/meals
// @access  Public

const getMeals = asyncHandler(async (req, res) => {
	const meals = await Meal.find({});
	res.json(meals);
});

// @desc    Fetch single meal
// @route   GET /api/meals/:id
// @access  Public

const getMealById = asyncHandler(async (req, res) => {
	const meal = await Meal.findById(req.params.id);
	if (meal) {
		return res.json(meal);
	}
	res.status(404);
	throw new Error('Resource not found');
});

export { getMeals, getMealById };
