import React from 'react';
import { inject, observer } from 'mobx-react';

const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const formatPoints = (price) => {
    return price.toFixed(0).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        
        const { points, paymentMethod, scrolled, assistcard } = this.props;
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
                        {paymentMethod.paymentInfo?this.renderLine(`Compra de puntos`, paymentMethod.paymentInfo.remainder):null}
                    </div>
                    <div className="charges__flat">
                        {paymentMethod.paymentInfo?this.renderLine(`Tasas y FEE`, paymentMethod.paymentInfo.rateAndFee):null}
                    </div>
                    <div className="charges__flat">
                        {this.props.assistcard.selectedProduct ? this.renderLine('Cobertura', this.props.assistcard.selectedProduct.amount) : null}
                    </div>
                    <div className="charges__flat total">
                        {paymentMethod.paymentInfo?this.renderLine(`Total a pagar`, !this.props.assistcard.selectedProduct?paymentMethod.paymentInfo.total:paymentMethod.paymentInfo.totalWithAssistance):null}
                    </div>
                    <div className="charges__flat">
                        {paymentMethod.paymentInfo?this.renderLine(paymentMethod.paymentInfo.installments>1?`${paymentMethod.paymentInfo.installments} cuotas sin intereses de`:'Un pago sin intereses de', !this.props.assistcard.selectedProduct?paymentMethod.paymentInfo.installmentPrice:paymentMethod.paymentInfo.dueValueWithAssistance):null}
                    </div>
                </div>
                <div className="charges__total">
                    {!this.state.collapsed?
                        <div className="charges__details"  style={{width:'100%'}}>
                            <div className="charges__flat">
                                {this.renderLinePoints('Puntos a canjear', points)}
                            </div>
                           <div className="charges__flat">
                                {paymentMethod.paymentInfo?this.renderLine(paymentMethod.paymentInfo.installments>1?`${paymentMethod.paymentInfo.installments} cuotas sin intereses de`:'Un pago sin intereses de', paymentMethod.paymentInfo.installmentPrice):null}
                            </div>
                        </div>
                        :<div>
                    <span className="charges__total--label">Incluye impuestos y tasas</span>
                    <span className="charges__total--price"></span>
                    </div>
                    }
            </div>
            </div>
        );
    }
}

export default Charges;