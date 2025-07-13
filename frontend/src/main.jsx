import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import './index.css';

import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import CartDetails from './components/CartDetails.jsx';
import Meals from './components/Meals.jsx';
import Login from './components/login.jsx';
import store from './store.js';
import Register from './components/Register.jsx';
import Shipping from './components/Shipping.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Payment from './components/Payment.jsx';
import PlaceOrder from './components/PlaceOrder.jsx';
import Order from './components/Order.jsx';
import Profile from './components/Profile.jsx';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path='/'
			element={<App />}
		>
			<Route
				index={true}
				path='/'
				element={<Meals />}
			/>

			<Route
				path='/meal/:id'
				element={<CartDetails />}
			/>

			<Route
				path='/login'
				element={<Login />}
			/>
			<Route
				path='/register'
				element={<Register />}
			/>
			<Route
				path=''
				element={<PrivateRoute />}
			>
				<Route
					path='/shipping'
					element={<Shipping />}
				/>
				<Route
					path='/payment'
					element={<Payment />}
				/>
				<Route
					path='/PlaceOrder'
					element={<PlaceOrder />}
				/>
				<Route
					path='/order/:id'
					element={<Order />}
				/>
				<Route
					path='/profile/'
					element={<Profile />}
				/>
			</Route>
		</Route>
	)
);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<PayPalScriptProvider deferLoading={true}>
				<RouterProvider router={router} />
			</PayPalScriptProvider>
		</Provider>
	</React.StrictMode>
);
