import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import { clearCart } from '../slices/cartSlice';
import Message from '../components/Message';
import { currencyFormatter } from '../util/formatting';
import Footer from '../pages/Footer';
import Button from './UI/Button';
import Spinner from '../pages/Spinner';
import CheckoutSteps from './CheckoutSteps';
import toast, { Toaster } from 'react-hot-toast';

const PlaceOrder = () => {
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const cart = useSelector(state => state.cart);

	const [createOrder, { isLoading, error }] = useCreateOrderMutation();

	useEffect(() => {
		if (!cart.shippingAddress.address) {
			navigate('/shipping');
		} else if (!cart.paymentMethod) {
			navigate('/payment');
		}
	}, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

	const placeOrderHandler = async () => {
		try {
			const res = await createOrder({
				orderItems: cart.cartItems,
				shippingAddress: cart.shippingAddress,
				paymentMethod: cart.paymentMethod,
				itemsPrice: cart.itemsPrice,
				shippingPrice: cart.shippingPrice,
				taxPrice: cart.taxPrice,
				totalPrice: cart.totalPrice,
			}).unwrap();
			dispatch(clearCart());
			navigate(`/order/${res._id}`);
		} catch (err) {
			toast.error(err);
		}
	};

	return (
		<>
			<div className='place-step'>
				<CheckoutSteps
					step1
					step2
					step3
					step4
				/>
			</div>
			<div className='fon-container'>
				<div className='PlaceOrder'>
					<div className='row'>
						<div className='col-container'>
							<h2>Shipping</h2>
							<main className='address-info'>
								<strong>Address:</strong>
								<span>{cart.shippingAddress.address}</span>
								<span> {cart.shippingAddress.city}</span>
								<span>{cart.shippingAddress.postalCode}</span>
								<span>{cart.shippingAddress.country}</span>
							</main>
						</div>

						<div className='read-more'></div>

						<div className='col-container'>
							<h2>Payment Method</h2>

							<main className='address-info'>
								<strong>Method:</strong>
								<span>{cart.paymentMethod}</span>
							</main>
						</div>

						<div className='read-more'></div>

						<div className='col-container'>
							<h2>Order Items</h2>
							{cart.cartItems.length === 0 ? (
								<Message>Your car is empty</Message>
							) : (
								<div className='PlaceOrder-items'>
									{cart.cartItems.map((item, orderId) => (
										<div
											className='PlaceOrder-list'
											key={orderId}
										>
											<div className='cols-rows'>
												<div className='cols'>
													<img
														src={item.image}
														alt={item.name}
													/>
												</div>

												<div className='PlaceOrder-item'>
													<div className='cols'>
														<Link to={`/product/${item.product}`}>
															{item.name}
														</Link>
													</div>
													<div className='cols-content'>
														<span>
															{item.qty} x{' '}
															{currencyFormatter.format(item.price)} ={' '}
															{currencyFormatter.format(item.qty * item.price)}
														</span>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<div className='PlaceOrder-content'>
						<div className='lists-group'>
							<div className='groups-rows'>
								<h2>Order Summary</h2>
							</div>
							<div className='groups-rows'>
								<main>
									<p>Items</p>

									<p>{currencyFormatter.format(cart.itemsPrice)}</p>
								</main>
							</div>
							<div className='groups-rows'>
								<main>
									<p>Shipping</p>
									<p>{currencyFormatter.format(cart.shippingPrice)}</p>
								</main>
							</div>
							<div className='groups-rows'>
								<main>
									<p>Tax</p>
									<p>{currencyFormatter.format(cart.taxPrice)}</p>
								</main>
							</div>
							<div className='groups-rows'>
								<main>
									<p>Total</p>
									<p>{currencyFormatter.format(cart.totalPrice)}</p>
								</main>
							</div>
							{error && <Message>{error}</Message>}
							<div className='groups-rows'>
								<Button
									type='button'
									disabled={cart.cartItems === 0}
									onClick={placeOrderHandler}
								>
									Place Order
								</Button>
								<Toaster
									reverseOrder={false}
									position='top-center'
									toastOptions={{
										style: {
											padding: '0.7rem 1rem',
											border: '1px solid #454545ff',
											color: '#6d0b0b',
											background: '#454545ff',
											width: 'auto',
											height: '100%',
											transition: 'filter .3s',
											transform: 'translate(-50%)',
											position: 'relative',
											top: 50,
										},
										iconTheme: {
											primary: '#454545ff',
											secondary: '#6d0b0b',
										},
									}}
								/>
								{isLoading && (
									<div className='place-spinner'>
										<Spinner />
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className='footer-PlaceOrder'>
					<Footer />
				</div>
			</div>
		</>
	);
};

export default PlaceOrder;
