import React from 'react';

const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
  
        const { price, nights , rooms} = this.props;
        const { price_detail } = price;
        const nightsText = nights>1?nights+' noches':nights+' noche';
        const roomsText = rooms>1?rooms+' habitaciones':rooms+' habitación';
        const baseRate = price_detail.charges.find(charge => charge.type==="base_rate").amount;
        const taxAndFee = price_detail.charges.reduce((acc, charge) =>{ 
            return acc + (charge.type==="tax_and_service_fee" ? charge.amount: 0)
        }, 0);
        return (
            <div className={`charges noselect ${this.state.collapsed ? 'charges--collapsed' : ''}`} onClick={this.toggleCollapsed}>
                <div className={`charges__details ${!this.state.collapsed ? 'charges__hidden' : ''}`}>
                    <div className="charges__headline">
                        <span>Detalle de su pago</span>
                    </div>
                    <div className="charges__flat">
                        {this.renderLine('Precio por noche por habitación', price.nightly_basis)}
                    </div>
                    <div className="charges__subtotals">
                        {this.renderLine(`${nightsText} - ${roomsText}`, baseRate)}
                        {this.renderLine('Impuestos y tasas',taxAndFee)}
                    </div>
                </div>
                <div className="charges__total">
                    <span className="charges__total--label">Total</span>
                    <span className="charges__total--price">ARS {formatPrice(price.total)}</span>
                </div>
            </div>
        );
    }
}

export default Charges;