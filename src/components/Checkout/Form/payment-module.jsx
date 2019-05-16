import React from 'react';

import PaymentType from './payment-type';
import PaymentInfo from './payment-info';

class PaymentModule extends React.Component {

    render () {
        return (
            <div>
                <div className="module">
                    <div className="module__top-headline">¿Cómo querés pagar?</div>
                    <PaymentType sendAttempted={this.props.sendAttempted} />
                    
                </div>
                <div className="module">
                    <div className="module__top-headline">Datos de tu tarjeta</div>
                    <PaymentInfo sendAttempted={this.props.sendAttempted} />
                </div>
            </div>
        );
    }
}

export default PaymentModule;