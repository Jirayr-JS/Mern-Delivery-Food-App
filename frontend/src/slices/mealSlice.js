import { MEALS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const mealSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getMeals: builder.query({
			query: () => ({
				url: MEALS_URL,
			}),
			keepUnusedDataFor: 5,
		}),
		getCartDetails: builder.query({
			query: mealId => ({
				url: `${MEALS_URL}/${mealId}`,
			}),
			keepUnusedDataFor: 5,
		}),
	}),
});

export const { useGetMealsQuery, useGetCartDetailsQuery } = mealSlice;
