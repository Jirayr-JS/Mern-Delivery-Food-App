import React from 'react';
import cart from '../assets/cart.png';

const CartLogo = ({ onClick }) => {
	return (
		<img
			className='cart-logo'
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			onClick={onClick}
			src={cart}
			alt='carts'
		/>
	);
};

export default CartLogo;
