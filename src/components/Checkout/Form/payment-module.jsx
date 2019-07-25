import React from 'react';


import PaymentType from './payment-type';
import PaymentRewards from './payment-rewards';
import PaymentInfo from './payment-info';

class PaymentModule extends React.Component {
    render () {
        const {rewards, paymentMethodId} = this.props;
        return (
            <div>
                <div className="module">
                    <div className="module__top-headline">¿Cómo querés pagar? {this.props.sendAttempted && paymentMethodId===undefined  ?
                    <div className="module__input-errors"><span>Debe Seleccionar un medio de pago</span></div>:null
                    }</div>
                   
                    {rewards?
                    <PaymentRewards sendAttempted={this.props.sendAttempted} />
                    :<PaymentType sendAttempted={this.props.sendAttempted} />}
                    
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