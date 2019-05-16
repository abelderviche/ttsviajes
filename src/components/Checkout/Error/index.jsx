import React from 'react';

const Error = ({ title, message }) => {
    return (
        <div className="checkout-error">
            <img src={require('assets/img/payment-error.svg')} alt="Error" />
            <div className="checkout-error__content">
                <span className="checkout-error__title">{title}</span>
                {message ? <span className="checkout-error__message">{message}</span> : null}
            </div>
        </div>
    );
}

export default Error;