import React from 'react';
import { inject, observer } from "mobx-react";

import Option from './option';
import HsbcOption from './hsbc-option';

@inject('paymentMethod','assistcard') @observer
class PaymentOptions extends React.Component {
    state = {
        collapsed: false,
        selectedPromos: []
    }

    resetState = () => {
        this.props.paymentMethod.resetSelections();
        this.props.setSelectedPromos([]);
        this.props.resetState();
    }

    selectBank = (bank, bankId) => {
        this.resetState();

        this.props.setSelectedPromos(bank.promos);
        this.props.setBankId(bankId);
        this.props.paymentMethod.setBank(bank);
    }
    
    selectPromo = (id, firstCardId, promo, firstCard) => {
        if (this.props.promoId !== id) {
            this.selectCreditCard(firstCardId, firstCard);
            this.props.paymentMethod.setPaymentMethodId(firstCard.paymentMethodId);
        }
        this.props.setPromoId(id);
        this.props.setPromo(promo);
    }

    selectCreditCard = (cardId, creditCard, promoId, promo) => {
        if (promoId && promo && this.props.promoId !== promoId) {
            this.props.setPromoId(promoId);
            this.props.setPromo(promo);
        }
        this.props.setCardId(cardId);
        
        this.props.paymentMethod.setCreditCard(creditCard);
        this.props.paymentMethod.setPaymentMethodId(creditCard.paymentMethodId);
    }
    
    selectHsbcCard = (cardId, creditCard, promoId, bank,resetOk = true) => {
      if (this.props.promoId !== promoId) {
        this.resetState();
            this.props.paymentMethod.setBank(bank);
            this.props.setPromoId(promoId);
        }
      
        
        this.props.setCardId(cardId);
        
        this.props.paymentMethod.setCreditCard(creditCard);
        this.props.paymentMethod.setPaymentMethodId(null);
        this.props.paymentMethod.setInstallmentOptions();
    }
    
    selectHsbcPromo = (promoId, bank, cardId, card) => {
        if (this.props.promoId !== promoId) {
            this.selectHsbcCard(cardId, card, promoId, bank,false);
        }
      //  this.props.paymentMethod.setPaymentMethodId(firstCard.paymentMethodId);
   //     this.props.paymentMethod.setBank(bank);
      //  this.props.setPromoId(promoId);

     //   this.props.paymentMethod.setInstallmentOptions();
    }

    render () {
        const { title, id, selected, paymentMethods, selectMethodGroup, bankId, promoId, cardId, selectedPromos, rewards} = this.props;
        const elementId = `${id}-pm`;
        return (
            <div className={`payment-method noselect ${selected ? 'payment-method__collapsed' : ''}`}>
                <input type="checkbox" id={elementId} className="payment-method__input" checked={selected} onChange={() => selectMethodGroup(id)}/>
                {!rewards?
                <label htmlFor={elementId} className="payment-method__row-title payment-method__input-label">
                    <div className="payment-method__option">
                        <div className="payment-method__option--radio-container">
                            <div className="payment-method__option--radio"></div>
                        </div>
                        <div className="payment-method__option--label">{title}</div>
                    </div>
                    <div className="payment-method__arrow-down">
                        <span className="arrow-icon">&nbsp;</span>
                    </div>
                </label>
                :null}
                {paymentMethods ? 
                    (id === 'hsbc' ? 
                    <HsbcOption id={id} banks={paymentMethods} selected={selected} 
                        promoId={promoId} cardId={cardId} selectPromo={this.selectHsbcPromo} 
                        selectCreditCard={this.selectHsbcCard} />
                    : 
                    <Option id={id} banks={paymentMethods} selectedPromos={selectedPromos} 
                        selected={selected} bankId={bankId} promoId={promoId} cardId={cardId}
                        selectBank={this.selectBank} selectPromo={this.selectPromo} selectCreditCard={this.selectCreditCard} rewards={rewards} /> )
                : null}
            </div>
        );
    }
}

export default PaymentOptions;