import React from 'react';
import { Toaster } from 'react-hot-toast';

const CartToaster = () => {
	return (
		<>
			<Toaster
				reverseOrder={false}
				position='top-center'
				toastOptions={{
					style: {
						padding: '0.7rem 1rem',
						border: '1px solid #454545ff',
						color: '#ffab04',
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
						secondary: '#ffab04',
					},
				}}
			/>
		</>
	);
};

export default CartToaster;
