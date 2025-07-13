import React, { useEffect, useState } from 'react';
import Button from './UI/Button';
import fonImg from '../assets/menu.png';
import Footer from '../pages/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import toast, { Toaster } from 'react-hot-toast';
import Spinner from '../pages/Spinner';

const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [register, { isLoading }] = useRegisterMutation();

	const { userInfo } = useSelector(state => state.auth);

	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const redirect = sp.get('redirect') || '/';

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	const submitHandler = async e => {
		e.preventDefault();
		try {
			const res = await register({ name, email, password }).unwrap();
			dispatch(setCredentials({ ...res }));
			dispatch(redirect);
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
	};

	return (
		<div
			className='login-content'
			style={{
				backgroundImage: `url(${fonImg})`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				marginTop: '-10rem',
			}}
		>
			<section className='register-form'>
				<form onSubmit={submitHandler}>
					<div className='form-group'>
						<h2>Sign Up</h2>
						<p className='control'>
							<label htmlFor='Full Name'>Name</label>
						</p>
						<input
							type='name'
							placeholder='Enter name'
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</div>
					<div className='form-group'>
						<p className='control'>
							<label htmlFor='Full Name'>E-Mail Address</label>
						</p>
						<input
							type='email'
							placeholder='Enter email'
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					</div>
					<div className='form-group'>
						<p className='control'>
							<label htmlFor='Full Name'>Password</label>
						</p>
						<input
							type='password'
							placeholder='Enter password'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
					<div className='form-group'>
						<p className='control'>
							<label htmlFor='Full Name'>Confirm Password</label>
						</p>
						<input
							type='password'
							placeholder='Confirm password'
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
						/>
					</div>

					<p className='login-actions'>
						<Button
							disabled={isLoading}
							type='submit'
						>
							Register
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
					</p>

					{isLoading && <Spinner />}
				</form>
				<main className='login-register'>
					<span>Already have an account?</span>

					<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
						Login
					</Link>
				</main>
			</section>

			<div className='footer-container'>
				<Footer />
			</div>
		</div>
	);
};

export default Register;
