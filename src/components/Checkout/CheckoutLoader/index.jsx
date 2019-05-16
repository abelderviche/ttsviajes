import React from 'react';
import Loader from 'components/Global/loader';

const CheckoutLoader = () => {
    return (
        <div className="checkout-loader">
            <div className="checkout-loader__box">
                <h2>ESTAMOS PROCESANDO TU SOLICITUD</h2>
                <Loader type="navigation-center"/>
                <p>Por favor, no cierres tu navegador, este proceso puede tardar hasta 60 segundos</p>
            </div>
        </div>
    );
}

export default CheckoutLoader;