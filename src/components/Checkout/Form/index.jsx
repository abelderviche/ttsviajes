import React from 'react';
import { inject, observer } from "mobx-react";

import PaymentModule from './payment-module';
import BillingModule from './billing-module';
import AssistcardModule from './assistcard-module';
import Button from './button';
import Error from '../Error';
import { animateScroll } from 'react-scroll'
const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
@inject('paymentMethod','reservations','assistcard') @observer
class Form extends React.Component {
    state = {
        sendAttempted: false
    }
    
    render() {
        const { action, loading, error, availablePayment, checkContact, changeCheck, product } = this.props;
        return (
            <div className="form">
                {
                    error  ?
                    <Error {...error}/>
                    : null
                }
                <PaymentModule sendAttempted={this.state.sendAttempted}  />
                <BillingModule sendAttempted={this.state.sendAttempted} />


            </div>
        )


      /*  return (
            <div className="form">
            <div className="segment__detail">
                <div className="noselect ">
                    <div className="module__payment-type">
                        <input type="checkbox" id="pinche" className="payment-method__input" checked={checkContact} onChange={changeCheck}/>
                        <label htmlFor="pinche" className="payment-method__row-title payment-method__input-label">
                            <div className="payment-method__option">
                                <div className="payment-method__option--radio-container">
                                    <div className="payment-method__option--radio"></div>
                                </div>
                                <div className="payment-method__option--label">Quiero que me contacte un vendedor</div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
                {
                    error && availablePayment ?
                    <Error {...error}/>
                    : null
                }
                {
                    availablePayment && loaded ? 
                    <PaymentModule sendAttempted={this.state.sendAttempted}  />
                    : null
                }
                {!this.props.reservations.product.fiscal_data?
                <BillingModule sendAttempted={this.state.sendAttempted} />
                :null    
                }
                {this.props.assistcard.availableProducts ? 
                    <AssistcardModule  />
                    :null
                }
                <Button action={() => {
                    this.setState({ sendAttempted: true })
                    action();
                }} 
                availablePayment={availablePayment}
                availableAssistCard={this.props.assistcard.availableProducts.length>0}
                selectedAssistcard = {this.props.assistcard.selectedProduct}
                price = {this.props.paymentMethod.paymentInfo && this.props.paymentMethod.paymentInfo.total? `ARS ${formatPrice(this.props.paymentMethod.paymentInfo.total)}`
                        :`ARS ${formatPrice(this.props.assistcard.selectedProduct?priceProduct+this.props.assistcard.selectedProduct.amount:priceProduct)}`}
               
                        loading={loading}
                        checkContact={checkContact} />
            </div>
        );*/
    }
}

export default Form;