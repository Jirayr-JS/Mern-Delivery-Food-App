import React from 'react';

const Message = ({ variant, children }) => {
	return (
		<div
			className='message-errors'
			variant={variant}
		>
			<p>{children}</p>
		</div>
	);
};

Message.defaultProps = {
	variant: 'info',
};

export default Message;
