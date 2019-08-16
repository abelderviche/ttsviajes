import React from 'react';

const ErrorRedirect = ({ title, message, url }) => {
    return (
        <div className="checkout-error-redirect-container">
            <div className="checkout-error-redirect">
                <img src={require('assets/img/payment-error.svg')} alt="Error" />
                <div className="checkout-error-redirect__content">
                    <span className="checkout-error-redirect__title">{title}</span>
                    {message ? <span className="checkout-error-redirect__message">{message}</span> : null}
                    {url?<a href={url}>Volver a buscar</a>:null}
                </div>
            </div>
        </div>
    );
}

export default ErrorRedirect;