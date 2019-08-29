import React from 'react';
import { inject, observer } from "mobx-react";

import PaymentModule from './payment-module';
import BillingModule from './billing-module';
import ContactModule from './contact-module';
import AssistcardModule from './assistcard-module';
import GuestModule from './guest-module';
import CheckFormData from './check-form-data';
import {Input} from './input';
import Button from './button';
import Error from '../Error';
import PaxModule from './pax-module';
import paymentMethod from '../../../stores/payment-method';
const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
@inject('checkout','paymentMethod') @observer
class Form extends React.Component {
    state = { 
        sendAttempted: false
    }
    
    render() {
        const { action, loading, error, availablePayment, checkContact, changeCheck, product, checkout} = this.props;
        const rewards = checkout.entityBank;
        return (
            <div className="form">
                {
                    error  ?
                    <Error {...error}/>
                    : null
                }
                {
                    checkout.activeComponents.map((component,k)=>{
                       if(component.name === 'FCB'){
                        return(
                            <div key={`component-${k}`}key={`component-${k}`}>
                                {Object.entries(this.props.paymentMethod.paymentMethods).length>0?
                                    <PaymentModule 
                                        paymentMethodId = {this.props.paymentMethod.paymentMethodId}
                                        sendAttempted={this.state.sendAttempted} 
                                        rewards={rewards} 
                                    />
                                :null}
                                <BillingModule sendAttempted={this.state.sendAttempted} />
                            </div>
                        )}
                        if(component.name === 'CONT'){
                            return(
                                <ContactModule key={`component-${k}`} sendAttempted={this.state.sendAttempted} />
                            )
                        }
                        if(component.name === 'PAXF'){
                            return(
                                <PaxModule  key={`component-${k}`}    sendAttempted={this.state.sendAttempted} />
                            )
                        }
                        if(component.name === 'PAXA'){
                            return(
                                <GuestModule  key={`component-${k}`}    sendAttempted={this.state.sendAttempted} />
                            )
                        }
                        if(component.name === 'ASCS'){
                            return(
                                <AssistcardModule />
                            )
                        }

                    })
                }

            {product==='flights'?<CheckFormData scrollTo={this.props.scrollTo} />:null}
            
                <div className="term-conditions">
                    <input type="checkbox"
                        checked={checkout.termAndConditions}
                        onChange={checkout.setTermAndConditions}
                    />
                    <span>{rewards?'Leí y acepto las condiciones de canje y política de privacidad':'Leí y acepto las condiciones de compray politica de privacidad'}</span>
                    {this.state.sendAttempted && !checkout.termAndConditions ?
                    <span className="error">Debe aceptar los terminos y condiciones</span>
                    :null}
                </div>

                <Button action={() => {
                            this.setState({ sendAttempted: true })
                            action();
                        }} 
                        loading={loading} 
                />
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