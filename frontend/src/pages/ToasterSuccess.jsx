import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToasterSuccess = () => {
	return (
		<>
			<Toaster
				reverseOrder={false}
				position='top-center'
				toastOptions={{
					style: {
						padding: '0.7rem 1rem',
						border: '1px solid #454545ff',
						color: '#22bb33',
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
						secondary: '#22bb33',
					},
				}}
			/>
		</>
	);
};

export default ToasterSuccess;
