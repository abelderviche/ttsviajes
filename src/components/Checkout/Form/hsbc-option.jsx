import React from 'react';
import { loadImage } from 'stores/utils';

const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Installment = ({ groupId, id, cardId, title, subtitle,interestTitle, creditCards, selected, selectPromo, selectCreditCard }) => {
    const elementId = `${groupId}-${id}`;
    const firstCardId = `${id}-${creditCards[0].cardCode}`;
    return (
        <div className="payment-method__installment noselect">
            <input type="checkbox" id={elementId} className="payment-method__input" checked={selected} onChange={() => selectPromo(id, firstCardId, creditCards[0])}/>
            <div className="payment-method__row payment-method__input-label">
                <label htmlFor={elementId} className="payment-method__option">
                    <div className="payment-method__option--radio-container">
                        <div className="payment-method__option--radio"></div>
                    </div>
                    <div className="payment-method__installment-label">
                        <div className="payment-method__installment-label--title">{title}</div>
                        <div className="payment-method__installment-label--subtitle">{subtitle}</div>
                    </div>
                    <div className="payment-method__installment-label">
                        <div className="payment-method__installment-label--interest-title">{interestTitle}</div>
                    </div>
                </label>
                <div className="payment-method__banks-list">
                    {creditCards.map(cc => {
                        const key = `${id}-${cc.cardCode}`;
                        const selected = key === cardId;
                        return (
                            <div key={key} 
                                className={`payment-method__bank ${selected ? 'payment-method__bank--selected' : ''}`}
                                onClick={() => selectCreditCard(key, cc, id)}>
                                <img className="payment-method__image" src={`${loadImage(cc.cardCode)}`} alt={cc.cardName} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

const InstallmentList = ({ id, banks, selectPromo, selectCreditCard, promoId, cardId }) => {
    return (
        <div className="payment-method__installments-list">
            <div className="payment-method__available--title">Elegí tu plan</div>
            
            {banks.map(bank => {
                const key = `${bank.bankCode}-${bank.segment}`;
                const selected = key === promoId;
                return (
                    <Installment 
                        key={key}
                        id={key}
                        groupId={id}
                        cardId={cardId}
                        selectCreditCard={(cardId, card, promoId) => selectCreditCard(cardId, card, promoId, bank)}
                        selected={selected}
                        selectPromo={(id, firstCardId, creditCard) => selectPromo(id, bank, firstCardId, creditCard)}
                        title={bank.segment} 
                        subtitle={`Hasta ${bank.maxInstallments} cuotas`}
                        interestTitle={`Total a pagar: ARS ${formatPrice(bank.promos[0].total)}; Intereses: ARS ${formatPrice(bank.promos[0].totalInterest)}`}
                        creditCards={bank.promos[0].creditCards} />
                );
            })}
            
        </div>
    )
}

const HsbcOption = ({id, selected, banks, promoId, cardId, selectPromo, selectCreditCard}) => {
    return (
        <div className={`payment-method__available ${!selected ? 'payment-method__noheight' : ''}`}>
            { banks && banks.length ? 
                <InstallmentList 
                    id={id} banks={banks} cardId={cardId} selectCreditCard={selectCreditCard}
                    promoId={promoId} selectPromo={selectPromo} /> : null }
        </div>
    )
}

export default HsbcOption