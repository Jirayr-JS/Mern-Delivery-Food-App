import React, { useState } from 'react';
import { currencyFormatter } from '../util/formatting.js';
import Button from './UI/Button.jsx';
import fonImg from '../assets/menu.png';
import Footer from '../pages/Footer.jsx';
import { saveShippingAddress } from '../slices/cartSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './CheckoutSteps.jsx';

const Shipping = () => {
	const cart = useSelector(state => state.cart);
	const { shippingAddress } = cart;

	const [address, setAddress] = useState(shippingAddress.address || '');
	const [city, setCity] = useState(shippingAddress.city || '');
	const [street, setStreet] = useState(shippingAddress.street || '');
	const [postalCode, setPostalCode] = useState(shippingAddress.code || '');
	const [country, setCountry] = useState(shippingAddress.country || '');
	const [phoneNumber, setPhoneNumber] = useState(
		shippingAddress.phoneNumber || ''
	);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { cartItems } = useSelector(state => state.cart);

	const submitHandler = e => {
		e.preventDefault();
		dispatch(
			saveShippingAddress({
				address,
				city,
				postalCode,
				country,
				street,
				phoneNumber,
			})
		);

		navigate('/payment');
	};

	const totalPrice = cartItems.reduce(
		(price, item) => price + item.qty * item.price,
		0
	);

	return (
		<div
			className='modal'
			style={{
				backgroundImage: `url(${fonImg})`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				marginTop: '-10rem',
			}}
		>
			<CheckoutSteps
				step1
				step2
			/>
			<section className='checkout-form'>
				<form onSubmit={submitHandler}>
					<div className='form-group'>
						<h2>Shipping</h2>
						<p>Total Amount: {currencyFormatter.format(totalPrice)}</p>
						<p className='control'>
							<label htmlFor='Full Name'>Address</label>
						</p>
						<input
							className='form-control'
							type='text'
							placeholder='Enter address'
							required
							value={address}
							onChange={e => setAddress(e.target.value)}
						/>
					</div>

					<div className='form-group'>
						<p className='control'>
							<label htmlFor='Full Name'>City</label>
						</p>
						<input
							className='form-control'
							type='text'
							placeholder='Enter city'
							required
							value={city}
							onChange={e => setCity(e.target.value)}
						/>
					</div>

					<div className='form-group'>
						<p className='control'>
							<label htmlFor='street'>Street</label>
						</p>
						<input
							className='form-control'
							type='text'
							placeholder='Enter street'
							required
							value={street}
							onChange={e => setStreet(e.target.value)}
						/>
					</div>

					<div className='form-group'>
						<p className='control'>
							<label htmlFor='postal code'>Postal Code</label>
						</p>
						<input
							className='form-control'
							type='text'
							placeholder='Enter  postal code'
							required
							value={postalCode}
							onChange={e => setPostalCode(e.target.value)}
						/>
					</div>

					<div className='form-group'>
						<p className='control'>
							<label htmlFor='city'>Country</label>
						</p>
						<input
							className='form-control'
							type='text'
							placeholder='Enter Country'
							required
							value={country}
							onChange={e => setCountry(e.target.value)}
						/>
					</div>

					<div className='form-group'>
						<p className='control'>
							<label htmlFor='phone'>Phone Number</label>
						</p>
						<input
							className='form-control'
							type='tel'
							placeholder='Enter phone'
							required
							value={phoneNumber}
							onChange={e => setPhoneNumber(e.target.value)}
						/>
						<p className='shipping-actions'>
							<Button>Submit Order</Button>
						</p>
					</div>
				</form>
			</section>
			<div className='footer-container'>
				<Footer />
			</div>
		</div>
	);
};

export default Shipping;
