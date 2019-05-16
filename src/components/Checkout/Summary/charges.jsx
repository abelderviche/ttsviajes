import React from 'react';
import ENV from 'config';

import { inject, observer } from 'mobx-react';

const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

@inject('paymentMethod','assistcard') @observer


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

    renderPerPassengerLine = (text, qty, price) => {
        return (
            <div className="charges__line">
                <span>{text} ({qty})</span>
                <span>ARS {formatPrice(price * qty)}</span>
            </div>
        )
    }


    render() {
        const { price } = this.props;
        const { detail } = price;
        return (
            <div className={`charges noselect ${this.state.collapsed ? 'charges--collapsed' : ''} ${ENV.SUBCHANNEL!=='tts'?`charges--${ENV.SUBCHANNEL}`:''}`} onClick={this.toggleCollapsed}>
                <div className={`charges__details ${!this.state.collapsed ? 'charges__hidden' : ''}`}>
                    <div className="charges__headline">
                        <span>Detalle de su pago</span>
                    </div>
                    <div className="charges__flat">
                        {this.renderLine('Tarifa por adulto', detail.adults.passenger_base_fare)}
                        {detail.children ? this.renderLine('Tarifa niño', detail.children.passenger_base_fare) : null}
                        {detail.infants ? this.renderLine('Tarifa infante', detail.infants.passenger_base_fare) : null}
                    </div>
                    <div className="charges__subtotals">
                        {this.renderPerPassengerLine('Adultos', price.adults.quantity, detail.adults.passenger_base_fare)}
                        {detail.children ? this.renderPerPassengerLine('Niños', price.children.quantity, detail.children.passenger_base_fare) : null}
                        {detail.infants ? this.renderPerPassengerLine('Infantes', price.infants.quantity, detail.infants.passenger_base_fare) : null}
                        <div className="charges__line">
                            <span>Impuestos y tasas</span>
                            <span>ARS {formatPrice(price.taxes)}</span>
                        </div>
                        <div className="charges__line">
                            <span>Cargos</span>
                            <span>ARS {formatPrice(price.charges)}</span>
                        </div>
                    {this.props.assistcard.selectedProduct ? this.renderLine('Cobertura', this.props.assistcard.selectedProduct.amount) : null}

                    </div>
                </div>
                <div className="charges__total">
                    <span className="charges__total--label">Total</span>
                    { 
                    
                    this.props.paymentMethod.paymentInfo && this.props.paymentMethod.paymentInfo.total?
                    <span className="charges__total--price">ARS {formatPrice(this.props.paymentMethod.paymentInfo.total)}</span>:
                    <span className="charges__total--price">ARS {formatPrice(this.props.assistcard.selectedProduct?price.total+this.props.assistcard.selectedProduct.amount:price.total)}</span>
                    }
                </div>
            </div>
        );
    }
}

export default Charges;