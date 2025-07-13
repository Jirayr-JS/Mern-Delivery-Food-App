import React, { useEffect, useState } from 'react';
import MealItem from './MealItem';
import Footer from '../pages/Footer';
import { useGetMealsQuery } from '../slices/mealSlice.js';
import Spinner from '../pages/Spinner';
import Message from './Message';

const Meals = () => {
	const [showLoader, setShowLoader] = useState(true);

	const { data: meals, isLoading, error } = useGetMealsQuery();

	useEffect(() => {
		if (isLoading) {
			setTimeout(() => {
				setShowLoader(false);
			}, 700);
		}
	}, [isLoading]);

	useEffect(() => {
		if (showLoader) {
			setTimeout(() => {
				setShowLoader(false);
			}, 700);
		}
	}, [showLoader]);

	return (
		<>
			{showLoader === true || isLoading === true ? (
				<Spinner />
			) : error ? (
				<Message variant='danger'>{error?.data.message || error.error}</Message>
			) : (
				<>
					<ul id='meals'>
						{meals.map(meal => (
							<MealItem
								key={meal._id}
								meal={meal}
							/>
						))}
					</ul>
					<Footer />
				</>
			)}
		</>
	);
};

export default Meals;
