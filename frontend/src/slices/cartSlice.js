import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const storedCartItems =
	localStorage.getItem('cartItems') !== null
		? JSON.parse(localStorage.getItem('cartItems'))
		: [];

const initialState = {
	cartItems: [],
	storedCartItems,
	shippingAddress: {},
	paymentMethod: 'PayPal',
};

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart: (state, action) => {
			const productToAdd = action.payload.product;
			const quantity = action.payload.num;
			const productExit = state.cartItems.find(
				item => item._id === productToAdd._id
			);
			if (productExit) {
				state.cartItems = state.cartItems.map(item =>
					item._id === action.payload.product._id
						? { ...productExit, qty: productExit.qty + action.payload.num }
						: item
				);
			} else {
				state.cartItems.push({ ...productToAdd, qty: quantity });
			}
			return updateCart(state);
		},

		decreaseQty: (state, action) => {
			const productTodCreaseQty = action.payload;
			const productExit = state.cartItems.find(
				item => item._id === productTodCreaseQty._id
			);
			if (productExit.qty === 1) {
				state.cartItems = state.cartItems.filter(
					item => item._id !== productExit._id
				);
			} else {
				state.cartItems = state.cartItems.map(item =>
					item._id === productExit._id
						? { ...productExit, qty: productExit.qty - 1 }
						: item
				);
			}
		},
		deleteProduct: (state, action) => {
			const productToDelete = action.payload;
			state.cartItems = state.cartItems.filter(
				item => item._id !== productToDelete._id
			);
			return updateCart(state);
		},
		clearCart: state => {
			state.cartItems = [];
			localStorage.setItem('CartItems', JSON.stringify(state));
		},
		saveShippingAddress: (state, action) => {
			state.shippingAddress = action.payload;
			localStorage.setItem('cartItems', JSON.stringify(state));
		},
		savePaymentMethod: (state, action) => {
			state.paymentMethod = action.payload;
			localStorage.setItem('cartItems', JSON.stringify(state));
		},
	},
});

export const cartMiddleware = store => next => action => {
	const result = next(action);
	if (action.type?.startsWith('cart/')) {
		const cartItems = store.getState().cart.cartItems;
		localStorage.setItem('cartItems', JSON.stringify(cartItems));
	}
	return result;
};

export const {
	addToCart,
	decreaseQty,
	deleteProduct,
	clearCart,
	saveShippingAddress,
	savePaymentMethod,
} = cartSlice.actions;

export default cartSlice.reducer;
