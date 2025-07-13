import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
	useDeliverOrderMutation,
	useGetOrderDetailsQuery,
	useGetPaypalClientIdQuery,
	usePayOrderMutation,
} from '../slices/orderApiSlice';
import Spinner from '../pages/Spinner';
import Message from './Message';
import Footer from '../pages/Footer';
import { currencyFormatter } from '../util/formatting';
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import toast, { Toaster } from 'react-hot-toast';

import Button from './UI/Button';
import ToasterSuccess from '../pages/ToasterSuccess';

const Order = () => {
	const [disable, setDisable] = useState(false);

	const { id: orderId } = useParams();

	const {
		data: order,
		refetch,
		isLoading,
		error,
	} = useGetOrderDetailsQuery(orderId);

	const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

	const [deliverOrder, { isLoading: loadingDeliver }] =
		useDeliverOrderMutation();

	const { userInfo } = useSelector(state => state.auth);

	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

	const {
		data: paypal,
		isLoading: loadingPayPal,
		error: errorPayPal,
	} = useGetPaypalClientIdQuery();

	useEffect(() => {
		if (!errorPayPal && !loadingPayPal && paypal.clientId) {
			const loadPaypalScript = async () => {
				paypalDispatch({
					type: 'resetOptions',
					value: {
						'client-id': paypal.clientId,
						currency: 'USD',
					},
				});
				paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
			};
			if (order && !order.isPaid) {
				if (!window.paypal) {
					loadPaypalScript();
				}
			}
		}
	}, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

	function onApprove(data, actions) {
		return actions.order.capture().then(async function (details) {
			try {
				await payOrder({ orderId, details });
				refetch();
				toast.success('Order is paid');
			} catch (err) {
				toast.error(err?.data?.message || err.error);
			}
		});
	}

	async function onApproveTest() {
		await payOrder({ orderId, details: { payer: {} } });
		refetch();
		toast.success('Order is paid');
		setDisable(true);
	}

	function onError(err) {
		toast.error(err.message);
	}

	function createOrder(data, actions) {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: { value: order.totalPrice },
					},
				],
			})
			.then(orderID => {
				return orderID;
			});
	}

	const deliverHandler = async () => {
		await deliverOrder(orderId);
		refetch();
	};

	return isLoading ? (
		<Spinner />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<>
			<div className='order-container'>
				<div className='order-place'>
					<h1>Order {order._id}</h1>
					<div className='order-row'>
						<div className='order-list'>
							<h2>Shipping</h2>
							<p>
								<strong>Name:</strong>
								<span> {order.user.name}</span>
							</p>

							<p>
								<strong>Email: </strong>
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>

							<p>
								<strong>Address:</strong>
								<span className='order-address-info'>
									{order.shippingAddress.address}, {order.shippingAddress.city}
									{order.shippingAddress.postalCode}
									{order.shippingAddress.country}
								</span>
							</p>
							{order.isDelivered ? (
								<div className='danger-success'>
									<p>Delivered on</p> {order.deliveredAt}
								</div>
							) : (
								<div className='message-danger'>
									{' '}
									<p>Not Delivered</p>{' '}
								</div>
							)}
							<div className='read-more'></div>
						</div>

						<div className='order-list'>
							<h2>Payment Method</h2>
							<p>
								<strong>Method:</strong>
								<span className='paypal'>{order.paymentMethod}</span>
							</p>

							{order.isPaid ? (
								<>
									<div className='danger-success'>
										<p style={{ color: '#70798bff' }}>
											Paid On{' '}
											<span style={{ color: '#70798bff' }}>{order.paidAt}</span>
										</p>{' '}
									</div>
								</>
							) : (
								<>
									<div className='message-danger'>
										{' '}
										<p>Not Paid</p>{' '}
									</div>
								</>
							)}
						</div>

						<div className='read-more'></div>

						<div className='order-list'>
							<h2>Order Items</h2>
							{order.orderItems.length === 0 ? (
								<Message>Order is empty</Message>
							) : (
								<div>
									{order.orderItems.map((item, orderId) => (
										<div
											className='PlaceOrder-list'
											key={orderId}
										>
											<div className='orders-rows'>
												<div className='orders'>
													<img
														src={item.image}
														alt={item.name}
													/>
												</div>

												<div className='PlaceOrder-item'>
													<div className='orders'>
														<Link
															className='order-email'
															to={`/product/${item.product}`}
														>
															{item.name}
														</Link>
													</div>
													<div className='orders-total-info'>
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

					<div className='order-content'>
						<div className='lists-group'>
							<div className='groups-rows'>
								<h2>Order Summary</h2>
							</div>

							<div>
								<div className='order-total'>
									<main>
										<span>Items</span>
										<span>{currencyFormatter.format(order.itemsPrice)}</span>
									</main>
								</div>
								<div className='order-total'>
									<main>
										<span>Shipping</span>
										<span>{currencyFormatter.format(order.shippingPrice)}</span>
									</main>
								</div>

								<div className='order-total'>
									<main>
										<span>Tax</span>

										<span>{currencyFormatter.format(order.taxPrice)}</span>
									</main>
								</div>

								<div className='order-total'>
									<main>
										<span>Total</span>
										<span>{currencyFormatter.format(order.totalPrice)}</span>
									</main>
								</div>
							</div>

							<div className='read-more'></div>

							<div className='order-paypal'>
								{!order.isPaid && (
									<div className='order-rows'>{loadingPay && <Spinner />}</div>
								)}

								{isPending ? (
									<Spinner />
								) : (
									<>
										<div>
											<Button
												style={{ marginTop: '0.2rem' }}
												onClick={onApproveTest}
												disabled={disable}
											>
												Test Pay Order
												<ToasterSuccess />
											</Button>
										</div>
										<div className='payment-method'>
											<PayPalButtons
												createOrder={createOrder}
												onApprove={onApprove}
												onError={onError}
											></PayPalButtons>
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
										</div>
									</>
								)}

								{loadingDeliver && <Spinner />}

								{userInfo &&
									userInfo.isAmin &&
									order.isPaid &&
									!order.isDelivered && (
										<Button onClick={deliverHandler}>Mark As Delivered</Button>
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

export default Order;
