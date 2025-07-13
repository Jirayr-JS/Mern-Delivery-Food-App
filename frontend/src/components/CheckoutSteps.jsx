import React from 'react';
import { NavLink } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
	return (
		<nav className='checkout-steps'>
			<main>
				{step1 ? (
					<NavLink to='/login'>
						<span>Sign In</span>
					</NavLink>
				) : (
					<span className='step-active'>Sign In</span>
				)}
			</main>

			<main>
				{step2 ? (
					<NavLink to='/shipping'>
						<span>Sipping</span>
					</NavLink>
				) : (
					<span className='step-active'>Sipping</span>
				)}
			</main>

			<main>
				{step3 ? (
					<NavLink to='/login'>
						<span>Payment</span>
					</NavLink>
				) : (
					<span className='step-active'>Payment</span>
				)}
			</main>

			<main>
				{step4 ? (
					<NavLink to='/login'>
						<span>Place Order</span>
					</NavLink>
				) : (
					<span className='step-active'>Place Order</span>
				)}
			</main>
		</nav>
	);
};

export default CheckoutSteps;
