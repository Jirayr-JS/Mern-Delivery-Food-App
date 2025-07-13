import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currencyFormatter } from '../util/formatting';
import {
	addToCart,
	clearCart,
	decreaseQty,
	deleteProduct,
} from '../slices/cartSlice';
import { X } from 'lucide-react';

const CartItem = () => {
	const dispatch = useDispatch();

	const { cartItems } = useSelector(state => state.cart);

	const clearCartItem = () => {
		dispatch(clearCart());
	};

	return (
		<>
			<button
				className='clear-cart'
				onClick={clearCartItem}
			>
				clear
			</button>

			{cartItems.map(item => {
				const productQty = item.price * item.qty;
				return (
					<div
						className='cart-info'
						key={item._id}
					>
						<li className='cart-item'>
							<section className='container'>
								<div className='cart-content'>
									<img
										src={item.image}
										alt={item.name}
									/>

									<div className='cart-slice'>
										<main>
											{item.name}
											<span>-</span> <span>{item.qty} </span>x
											<span className='cart-price'>
												{currencyFormatter.format(productQty)}
											</span>
											<div className='clear-item'>
												<X onClick={() => dispatch(deleteProduct(item))} />
											</div>
										</main>
									</div>
								</div>

								<main className='cart-item-actions'>
									<button onClick={() => dispatch(decreaseQty(item))}>
										<span className='cart-items'>-</span>
									</button>

									<span>{item.qty}</span>
									<button
										onClick={() =>
											dispatch(addToCart({ product: item, num: 1 }))
										}
									>
										<span className='cart-items'>+</span>
									</button>
									<p className='cart-total'></p>
								</main>
							</section>
						</li>
					</div>
				);
			})}
		</>
	);
};

export default CartItem;
