import React, { useEffect, useRef, useState } from 'react';
import Button from './UI/Button.jsx';
import logoImg from '../assets/logo.jpg';
import { FaUser } from 'react-icons/fa';
import { AiFillCaretDown } from 'react-icons/ai';
import { AiFillCaretUp } from 'react-icons/ai';
import { Models } from '../outs/Models.js';
import { X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import CartLogo from '../pages/CartLogo.jsx';
import CartItem from './CartItem.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { currencyFormatter } from '../util/formatting.js';
import { useLogoutMutation } from '../slices/userApiSlice.js';
import { logout } from '../slices/authSlice.js';

const Header = () => {
	const [isOpen, setOpen] = useState();
	const [active, setActive] = useState(false);

	const menuRef = useRef(null);
	const dropDown = useRef(null);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { cartItems } = useSelector(state => state.cart);
	const { userInfo } = useSelector(state => state.auth);

	const [logoutApiCall] = useLogoutMutation();

	const logoutHandler = async () => {
		try {
			await logoutApiCall().unwrap();
			dispatch(logout());
			navigate('/login');
		} catch (err) {
			console.error(err);
		}
	};

	const totalPrice = cartItems.reduce(
		(price, item) => price + item.qty * item.price,
		0
	);

	const totalNumbers = cartItems.reduce((totalNumberOfItems, item) => {
		return totalNumberOfItems + item.qty;
	}, 0);

	Models(menuRef, () => {
		if (isOpen) setTimeout(() => setOpen(false), 50);
	});

	const clickHome = () => {
		navigate('/');
	};

	const checkoutHandler = () => {
		navigate('/login?redirect=/shipping');
	};

	useEffect(() => {
		const showHandler = e => {
			if (!dropDown.current.contains(e.target)) {
				setActive(false);
			}
		};

		if (active) {
			document.addEventListener('mousedown', showHandler);
		}

		return () => document.addEventListener('mousedown', showHandler);
	}, [active]);

	return (
		<header id='main-header'>
			<div id='title'>
				<img
					onClick={clickHome}
					src={logoImg}
					alt='A restaurant'
				/>

				<h1>DeliveryFood</h1>
			</div>

			<nav ref={dropDown}>
				{userInfo ? (
					<>
						<main className='user-profile'>
							<span className='user-info'>{userInfo.name}</span>
							<span className='login-name'>
								{active ? (
									<AiFillCaretUp className='user-select' />
								) : (
									<AiFillCaretDown
										className='user-select'
										onClick={() => setActive(prev => !prev)}
									/>
								)}
							</span>

							{active && (
								<div className='dropdown'>
									<div className='dropdown-content'>
										<NavLink to='/profile'>
											<span className='login-name'>Profile</span>
										</NavLink>
										<NavLink onClick={logoutHandler}>
											<span className='login-name'>Logout</span>
										</NavLink>
									</div>
								</div>
							)}
						</main>
					</>
				) : (
					<NavLink
						className='user-profile'
						to='/login'
					>
						<span className='login-name'>Sign In</span>

						<FaUser
							className='icon'
							style={({ isActive }) => ({
								color: isActive ? '#ffab04' : '#ffc404',
							})}
						/>
					</NavLink>
				)}

				<Button textOnly>
					<CartLogo
						isActive={open}
						onClick={() => setOpen(!isOpen)}
					/>

					{cartItems.length > 0 && (
						<span className='carts'>{cartItems.length}</span>
					)}
				</Button>
				{isOpen ? (
					<div className='cart-backdrop'>
						<main
							className='xls'
							open={isOpen}
							onClick={() => setOpen(!isOpen)}
						>
							<X size={30} />
						</main>
					</div>
				) : null}
			</nav>

			<div
				className={`cart ${isOpen ? 'active' : null}`}
				ref={menuRef}
			>
				<div className='cart-item-list'>
					{cartItems.length === 0 ? (
						<p className='cart-total'>There Are No Items In The Cart</p>
					) : (
						<>
							<CartItem />
						</>
					)}
				</div>

				<div
					className='wrap-checkout'
					open={isOpen}
					onClick={() => setOpen(!isOpen)}
				>
					<div className='btn-checkout'>
						{cartItems.length === 0 ? (
							<div className='cart-checkout'>
								<Link to='/'>Add Products</Link>
							</div>
						) : (
							<div
								className='go-to-checkout'
								onClick={checkoutHandler}
							>
								<span className='total-number'>{totalNumbers}</span>
								<div>
									<Link to='/shipping'>Go to Checkout</Link>
								</div>

								<div className='total-price-item'>
									<span> {currencyFormatter.format(totalPrice)}</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
