import React, { useState } from 'react';
import Button from './UI/Button';
import { currencyFormatter } from '../util/formatting';
import CartToaster from '../pages/CartToaster';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, clearCart } from '../slices/cartSlice';

const MealItem = ({ meal }) => {
	const [clickLoader, setClickLoader] = useState(false);

	const dispatch = useDispatch();

	const navigate = useNavigate();

	const handleAdd = productItem => {
		dispatch(addToCart({ product: productItem, num: 1 }));
		toast.success('Product Added To Cart');
		setClickLoader(true);
	};

	const clickDetails = () => {
		navigate(`/meal/${meal._id}`);
	};

	const clearItem = () => {
		dispatch(clearCart(meal));
	};

	return (
		<li className='meal-item'>
			<article>
				<img
					onClick={clickDetails}
					src={meal.image}
					alt={meal.name}
				/>

				<div>
					<h3 onClick={clickDetails}>{meal.name}</h3>
					<p className='meal-item-price'>
						{currencyFormatter.format(meal.price)}
					</p>
					<p className='meal-item-description'>{meal.description}</p>
				</div>

				<p className='meal-item-actions'>
					{clearItem.length === 0 ? (
						<Button
							disabled={clickLoader}
							onClick={() => handleAdd(meal)}
						>
							{clickLoader ? 'In To Cart' : 'Add To Cart'}

							{clickLoader && <CartToaster />}
						</Button>
					) : (
						<Button onClick={() => handleAdd(meal)}>Add To Cart</Button>
					)}
				</p>
			</article>
		</li>
	);
};

export default MealItem;
