import React, { useEffect, useState } from 'react';
import Button from './UI/Button';
import Footer from '../pages/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';
import { useProfileMutation } from '../slices/userApiSlice';
import toast from 'react-hot-toast';
import { setCredentials } from '../slices/authSlice';
import Spinner from '../pages/Spinner';
import Message from './Message';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ToasterSuccess from '../pages/ToasterSuccess';

const Profile = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const dispatch = useDispatch();

	const { userInfo } = useSelector(state => state.auth);

	const { data: orders, isLoading, error } = useGetMyOrdersQuery();

	const [updateProfile, { isLoading: loadingUpdateProfile }] =
		useProfileMutation();

	useEffect(() => {
		setName(userInfo.name);
		setEmail(userInfo.email);
	}, [userInfo.email, userInfo.name]);

	const submitHandler = async e => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error('Password do not match');
		} else {
			try {
				const res = await updateProfile({
					_id: userInfo._id,
					name,
					email,
					password,
				}).unwrap();
				dispatch(setCredentials({ ...res }));
				toast.success('Profile updated successfully');
			} catch (err) {
				toast.error(err?.data?.message || err.error);
			}
		}
	};

	return (
		<div className='profile'>
			<section className='profile-form'>
				<div className='profile-content'>
					<form onSubmit={submitHandler}>
						<div className='profile-group'>
							<h2>User Profile</h2>
							<p className='control'>
								<label htmlFor='Full Name'>Name</label>
							</p>
							<input
								className='profile-input'
								type='name'
								placeholder='Enter name'
								value={name}
								onChange={e => setName(e.target.value)}
							/>
							<div className='profile-group'>
								<p className='control'>
									<label htmlFor='Full Name'>E-Mail Address</label>
								</p>
								<input
									className='profile-input'
									type='email'
									placeholder='Enter email'
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
							</div>
							<div className='profile-group'>
								<p className='control'>
									<label htmlFor='Full Name'>Password</label>
								</p>
								<input
									className='profile-input'
									type='password'
									placeholder='Enter password'
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
							</div>
							<div className='profile-group'>
								<p className='control'>
									<label htmlFor='Full Name'>Confirm Password</label>
								</p>
								<input
									className='profile-input'
									type='password'
									placeholder='Confirm password'
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
								/>
							</div>
						</div>
						<p className='profile-actions'>
							<Button type='submit'>Update</Button>
							<ToasterSuccess />
							{loadingUpdateProfile && <Spinner />}
						</p>
					</form>

					<div>
						<h2>My Orders</h2>
						{isLoading ? (
							<Spinner />
						) : error ? (
							<Message variant='danger'>
								{error?.data?.message || error.error}
							</Message>
						) : (
							<table>
								<thead>
									<tr>
										<th>ID</th>
										<th>DATE</th>
										<th>TOTAL</th>
										<th>PAID</th>
										<th>DELIVERED</th>
										<th></th>
									</tr>
								</thead>

								<tbody>
									{orders.map(order => (
										<tr key={order._id}>
											<td>{order._id}</td>
											<td>{order.createdAt.substring(0, 10)}</td>
											<td>{order.totalPrice}</td>
											<td>
												{order.isPaid ? (
													order.paidAt.substring(0, 10)
												) : (
													<FaTimes style={{ color: '#a7041aff' }} />
												)}
											</td>
											<td>
												{order.isDelivered ? (
													order.deliveredAt.substring(0, 10)
												) : (
													<FaTimes style={{ color: '#a7041aff' }} />
												)}
											</td>
											<td>
												<Link to={`/order/${order._id}`}>
													<Button>Details</Button>
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</section>

			<div className='profile-footer'>
				<Footer />
			</div>
		</div>
	);
};

export default Profile;
