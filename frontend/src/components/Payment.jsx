import React, { useEffect, useState } from 'react';
import CheckoutSteps from './CheckoutSteps';
import Button from './UI/Button';
import Footer from '../pages/Footer';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';

const Payment = () => {
	const [paymentMethod, setPaymentMethod] = useState('Paypal');

	const navigate = useNavigate();
	const cart = useSelector(state => state.cart);
	const { shippingAddress } = cart;

	const dispatch = useDispatch();

	useEffect(() => {
		if (!shippingAddress.address) {
			navigate('/shipping');
		}
	}, [navigate, shippingAddress]);

	const submitHandler = e => {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod));
		navigate('/PlaceOrder');
	};

	return (
		<div className='payment'>
			<div className='steps-payment'>
				<CheckoutSteps
					step1
					step2
					step3
				/>
			</div>
			<h1>Payment Method</h1>

			<div className='payment-form'>
				<span className='payment-paypal'> Select Method</span>
				<form onSubmit={submitHandler}>
					<input
						type='radio'
						aria-label='PayPal or Credit Card'
						id='PayPal'
						name='paymentMethod'
						value='PayPal'
						checked
						onChange={e => setPaymentMethod(e.target.value)}
					/>

					<label className='payment-label'>PayPal or Credit Card</label>
					<p className='payment-actions'>
						<Button type='submit'>Continue</Button>
					</p>
				</form>
			</div>

			<div className='footer-payment'>
				<Footer />
			</div>
		</div>
	);
};

export default Payment;
