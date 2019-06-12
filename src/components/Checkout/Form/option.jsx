import React from 'react';
import { loadImage } from 'stores/utils';

const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Installment = ({ groupId, id, cardId, title, subtitle, interestTitle,creditCards, selected, selectPromo, selectCreditCard ,rewards}) => {
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
                {!rewards?
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
                        )
                    })}
                </div>
                :null}
            </div>
        </div>
    )
}

const InstallmentList = ({ id, bankId, promoId, cardId, installments, selectPromo, selectCreditCard ,rewards}) => {
    return (
        <div className="payment-method__installments-list">
            <div className="module__input--title">Elegí las cuotas</div>
            {installments.map(inst => {
                const key = `${inst.installments}-${bankId}-${inst.interestRate}`;
                const selected = key === promoId;
                const titleAmount = `${inst.installments} ${inst.installments === 1 ? 'pago' : 'cuotas'}`;
                const titleInterest = `${inst.totalInterest === 0 && inst.installments > 1 ? 'sin interés' : (inst.installments === 1 ? '' : 'fijas')}`;

                return (
                    <Installment 
                        key={key}
                        id={key}
                        groupId={id}
                        cardId={cardId}
                        selected={selected}
                        selectPromo={(id, firstCardId, firstCard) => selectPromo(id, firstCardId, inst, firstCard)}
                        title={`${titleAmount} ${titleInterest}`} 
                        subtitle={`de ARS ${formatPrice(inst.installmentCost)}`}
                        interestTitle={`Total a pagar: ARS ${formatPrice(inst.total)}; Intereses: ARS ${formatPrice(inst.totalInterest)}`}
                        creditCards={inst.creditCards} 
                        rewards={rewards}
                        selectCreditCard={(cardId, card, promoId) => selectCreditCard(cardId, card, promoId, inst)} />
                );
            })}
        </div>
    )
}

const Option = ({id, selected, banks, selectedPromos, bankId, promoId, cardId, selectBank, selectPromo, selectCreditCard,rewards}) => {
    return (
        <div className={`payment-method__available ${!selected ? 'payment-method__noheight' : ''}`}>
            <div className="payment-method__available--title">{rewards?'Elegí tu tu tarjeta':'Elegí tu banco'}</div>
            <div className="payment-method__banks-list">
                {banks.map(bank => {
                    const key = `${bank.bankCode}-${bank.segment}-${bank.promos.length}`;
                    const selected = key === bankId;
                    return (
                        <div key={key} onClick={() => selectBank(bank, key)}
                            className={`payment-method__bank margin-bottom-16 ${selected ? 'payment-method__bank--selected' : ''}`}>
                            <img className="payment-method__image" 
                                src={`https://cdn.ttsviajes.com/img/bcra/${bank.bankCode}.png`} 
                                alt={bank.bankName} />
                        </div>
                    );
                })}
            </div>
            {/* <div className="payment-method__more"><span>Ver más</span></div> */}
            { selectedPromos && selectedPromos.length ? 
                <InstallmentList 
                    id={id} cardId={cardId}
                    selectCreditCard={selectCreditCard}
                    bankId={bankId} installments={selectedPromos} 
                    rewards={rewards}
                    promoId={promoId} selectPromo={selectPromo} /> : null }
        </div>
    )
}

export default Option