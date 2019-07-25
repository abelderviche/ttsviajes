import React from 'react';
import { inject, observer } from 'mobx-react';

const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const formatPoints = (price) => {
    return price.toFixed(0).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


@inject('paymentMethod') @observer

class Charges extends React.Component {

    state = {
        collapsed: true
    }

    toggleCollapsed = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    renderLine = (text, price) => {
        return (
            <div className="charges__line">
                <span>{text}</span>
                <span>ARS {formatPrice(price)}</span>
            </div>
        )
    }
    renderLinePoints = (text, points) => {
        return (
            <div className="charges__line">
                <span>{text}</span>
                <span>{formatPoints(Number(points))} Puntos</span>
            </div>
        )
    }

    renderPerPassengerLine = (text, qty, price) => {
        return (
            <div className="charges__line">
                <span>{text} ({qty})</span>
                <span>ARS {formatPrice(price * qty)}</span>
            </div>
        )
    }

    

    render() {
  
        const { points, paymentMethod, scrolled } = this.props;
        return (
            <div className={`charges noselect ${this.state.collapsed ? 'charges--collapsed' : ''} ${scrolled ? 'charges--floating' : ''}`} onClick={this.toggleCollapsed}>
                <div className={`charges__details ${!this.state.collapsed ? 'charges__hidden' : ''}`}>
                    <div className="charges__headline">
                        <span>DETALLE DEL CANJE</span>
                    </div>
                    <div className="charges__flat">
                        {this.renderLinePoints('Puntos a canjear', points)}
                    </div>
                    <div className="charges__flat">
                        {paymentMethod.paymentInfo?this.renderLine(`${paymentMethod.paymentInfo.installments} cuota${paymentMethod.paymentInfo.installments>1?'s':''} sin intereses`, paymentMethod.paymentInfo.installmentPrice):null}
                    </div>
                </div>
                <div className="charges__total">
                    <span className="charges__total--label">Incluye impuestos y tasas</span>
                    <span className="charges__total--price"></span>
                </div>
            </div>
        );
    }
}

export default Charges;