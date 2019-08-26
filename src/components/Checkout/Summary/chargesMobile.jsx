import React from 'react';
import { inject, observer } from 'mobx-react';

const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

@inject('paymentMethod') @observer

class Charges extends React.Component {

    renderLine = (text, price) => {
        return (
            <div className="summary_mobile__line">
                <span>{text}</span>
                <span className="price">ARS {formatPrice(price)}</span>
            </div>
        )
    }
    renderLinePoints = (text, points) => {
        return (
            <div className="summary_mobile__line">
                <span>{text}</span>
                <span className="price">{points} Puntos</span>
            </div>
        )
    }

    renderPerPassengerLine = (text, qty, price) => {
        return (
            <div className="summary_mobile__line">
                <span>{text} ({qty})</span>
                <span className="price">ARS {formatPrice(price * qty)}</span>
            </div>
        )
    }

    

    render() {
        const { points, price, paymentMethod , rewards} = this.props;
        //  {paymentMethod.paymentInfo?this.renderLine(`${paymentMethod.paymentInfo.installments} cuota${paymentMethod.paymentInfo.installments>1?'s':''} sin intereses`, paymentMethod.paymentInfo.installmentPrice):null}
        return (
            <div >
                {points && points>0? this.renderLinePoints('Puntos a canjear', points):null}
                {paymentMethod.paymentInfo?this.renderLine(paymentMethod.paymentInfo.installments>1?`${paymentMethod.paymentInfo.installments} cuotas sin intereses de`:'Un pago sin intereses de', paymentMethod.paymentInfo.installmentPrice):null}

            </div>
        );
    }
}

export default Charges;