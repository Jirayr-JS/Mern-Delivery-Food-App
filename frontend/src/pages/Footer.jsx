import React from 'react';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer>
			<div>
				<p
					style={{
						textTransform: 'uppercase',
						color: '#ffc404',
					}}
				>
					Delivery Food &copy; {currentYear}
				</p>
			</div>
		</footer>
	);
};

export default Footer;
