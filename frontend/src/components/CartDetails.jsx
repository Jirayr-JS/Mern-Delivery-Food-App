import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { currencyFormatter } from '../util/formatting';
import Footer from '../pages/Footer';
import { useGetCartDetailsQuery } from '../slices/mealSlice';
import Spinner from '../pages/Spinner';
import Button from './UI/Button';
import Message from './Message';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';

const CartDetails = () => {
	const [count, setCount] = useState(1);
	const { id: mealId } = useParams();

	const dispatch = useDispatch();

	const { data: meal, isLoading, error } = useGetCartDetailsQuery(mealId);

	const handleAdd = (meal, quantity) => {
		dispatch(addToCart({ product: meal, num: quantity }));
	};

	return (
		<div className='details-content'>
			{isLoading ? (
				<Spinner />
			) : error ? (
				<Message variant='danger'>{error?.data.message || error.error}</Message>
			) : (
				<>
					<div className='products-details'>
						<div className='cart-details'>
							<img
								src={meal.image}
								alt={meal.name}
							/>

							<div className='details-info'>
								<div>
									<p className='product-price'>
										{currencyFormatter.format(meal.price)}
									</p>
								</div>
								<p className='product-description'>{meal.description}</p>
							</div>
						</div>
						<div className='product-name'>
							<div className='status-info'>
								<div className='details-price'>
									<h1>{meal.name}</h1>
								</div>
								<div className='details-price'>
									<p>Price: </p>
									<p className='name-price'>{meal.price}</p>
								</div>
								<div className='details-price'>
									<p>Delivery: </p>
									<p>{meal.ForFree > 0 ? 'Paid ' : 'For Free'}</p>
								</div>

								<main className='details-actions'>
									<button>
										<span onClick={() => setCount(count - 1)}>-</span>
									</button>

									<span>{count}</span>
									<button>
										<span onClick={() => setCount(count + 1)}>+</span>
									</button>
								</main>
								<p className='details-item-actions'>
									<Button
										type='button'
										className='details-add'
										disabled={meal.ForFree === 0}
										onClick={() => handleAdd(meal, count)}
									>
										Add To Cart
									</Button>
								</p>
							</div>
						</div>
					</div>
				</>
			)}

			<div className='footer-details'>
				<Footer />
			</div>
		</div>
	);
};

export default CartDetails;
