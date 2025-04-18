import React from 'react';
import { inject, observer } from "mobx-react";
import { loadImage } from 'stores/utils';
import Loader from 'components/Global/loader';

import PaymentOptions from './payment-options';
import Input, { DropdownInput } from './input';

const formatPrice = (price) => {
    
    return parseFloat(price).toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //return price;
}

@inject('paymentMethod','assistcard') @observer
class PaymentType extends React.Component {
    state = {
        methodGroup: '',
        bankId: '',
        promoId: '',
        cardId: '',
        selectedPromos: []
    }
    setMethodGroup = (id) => {
        if (this.props.paymentMethod.methodGroup !== id) {
            this.props.paymentMethod.setMethodGroup(id);
        } else {
            this.props.paymentMethod.setMethodGroup('');
        }
        this.resetState();
        this.props.paymentMethod.resetSelections();
    }

    setSelectedPromos = (promos) => {
        this.props.paymentMethod.setSelectedPromos(promos);
        this.setState({ selectedPromos: promos });
    }

    setBankId = (bankId) => {
        this.setState({ bankId });
    }

    setPromoId = (promoId) => {
        this.setState({ promoId });
    }

    setCardId = (cardId) => {
        this.setState({ cardId });
    }

    resetState = () => {
        this.setState({ bankId: '', cardId: '', promoId: '', selectedPromos: [] });
        this.props.paymentMethod.setSelectedPromos([]);

    }
    componentWillReceiveProps(nextProps){
        if(nextProps.paymentMethod.installmentOptions.length > 0){
            this.props.paymentMethod.setInstallmentsFromOptions(this.props.paymentMethod.installments);
        }
    }

    // hay que ver que opcion por default seleccionar o algo asi..... 
    setPromo = (promo) => {
        this.props.paymentMethod.setPaymentInfo({
            fare: promo.fare,
            fee: promo.fee,
            total: promo.total,
            interest: promo.totalInterest,
            tea: promo.tea,
            cft: promo.cft,
            rate: promo.interestRate,
            installments: promo.installments,
            installmentPrice: promo.installmentCost,
            firstInstallment: promo.firstInstallment,
            bines: promo.bines,
            initialDue: promo.initialDue,
            firstInstallment: promo.firstInstallment,
            totalWithAssistance: promo.totalWithAssistance,
            dueValueWithAssistance: promo.dueValueWithAssistance,
        });
        this.props.paymentMethod.setInstallments(promo.installments);
    }

    renderLogo(imgCode, alt) {
        return (
            <div className="payment-method__bank-container">
                <div className="payment-method__bank">
                {
                    imgCode ?
                    <img className="payment-method__image" src={imgCode} alt={alt} />
                    :
                    <div className="payment-method__bank--notselected"></div>
                }
                </div>
            </div>
        )
    }

    render () {
        const { paymentMethod } = this.props;
        const { paymentMethods, bank, creditCard, pureCreditCard, paymentInfo, installments } = paymentMethod;
        const installmentPrice = !this.props.assistcard.selectedProduct?formatPrice(paymentMethod.installmentPrice):formatPrice(paymentMethod.paymentInfo.dueValueWithAssistance)
        return (
            <div className="module__payment-type">
                {!(paymentMethods.hsbc && paymentMethods.withInterest && paymentMethods.withoutInterest) ? 
                    <Loader type="pulse" /> : null}
                {paymentMethods.hsbc && paymentMethods.hsbc.length ? 
                    <PaymentOptions 
                        id='hsbc'
                        title={<div><span>Pago con tarjetas exclusivas de </span><span className="bold">HSBC sin interés</span></div>} 
                        selected={this.props.paymentMethod.methodGroup === 'hsbc'}
                        paymentMethods={paymentMethods.hsbc}
    
                        setBankId={this.setBankId}
                        setPromoId={this.setPromoId}
                        setCardId={this.setCardId}
                        bankId={this.state.bankId}
                        promoId={this.state.promoId}
                        cardId={this.state.cardId}
                        resetState={this.resetState}
                        setSelectedPromos={this.setSelectedPromos}
                        selectedPromos={this.props.paymentMethod.selectedPromos}
                        //selectedPromos={this.state.selectedPromos}
    
                        selectMethodGroup={this.setMethodGroup}
                        setPromo={this.setPromo} /> : null}
                {paymentMethods.withInterest && paymentMethods.withInterest.length ? 
                    <PaymentOptions 
                        id='with-interest'
                        title={<div><span>Pago con tarjetas en </span><span className="bold">cuotas fijas</span></div>}
                        selected={this.props.paymentMethod.methodGroup === 'with-interest'}
                        paymentMethods={paymentMethods.withInterest}
    
                        setBankId={this.setBankId}
                        setPromoId={this.setPromoId}
                        setCardId={this.setCardId}
                        bankId={this.state.bankId}
                        promoId={this.state.promoId}
                        cardId={this.state.cardId}
                        resetState={this.resetState}
                        setSelectedPromos={this.setSelectedPromos}
                        selectedPromos={this.props.paymentMethod.selectedPromos}
                        //selectedPromos={this.state.selectedPromos}
    
                        selectMethodGroup={this.setMethodGroup}
                        setPromo={this.setPromo} /> : null}
                {paymentMethods.withoutInterest && paymentMethods.withoutInterest.length ? 
                    <PaymentOptions 
                        id='without-interest'
                        title={<div><span>Pago con tarjetas </span><span className="bold">sin interés</span></div>} 
                        selected={this.props.paymentMethod.methodGroup === 'without-interest'}
                        paymentMethods={paymentMethods.withoutInterest}
    
                        setBankId={this.setBankId}
                        setPromoId={this.setPromoId}
                        setCardId={this.setCardId}
                        bankId={this.state.bankId}
                        promoId={this.state.promoId}
                        cardId={this.state.cardId}
                        resetState={this.resetState}
                        setSelectedPromos={this.setSelectedPromos}
                        selectedPromos={this.props.paymentMethod.selectedPromos}
                        //selectedPromos={this.state.selectedPromos}
    
                        selectMethodGroup={this.setMethodGroup}
                        setPromo={this.setPromo} /> : null}
                <div className="module__component">
                    <div className="module__headline">Forma de pago seleccionada</div>
                    <div className="component-container">
                        <div className="module__form-group--centered">
                            <div className="payment-method__card-selection">
                                {this.renderLogo(bank ? `https://cdn.ttsviajes.com/img/bcra/${bank.bankCode}.png` : '', bank ? bank.bankName : '')}
                                {!pureCreditCard ? this.renderLogo((creditCard ? loadImage(creditCard.cardCode) : ''), creditCard ? creditCard.cardName : '') : null}
                                {
                                    paymentMethod.installmentOptions.length > 0 ?
                                    <Input>
                                        <DropdownInput size="medium"
                                            value={typeof paymentMethod.installments !== 'undefined'?paymentMethod.installments:null}
                                            valid={paymentMethod.validInstallments}
                                            forceValidation={this.props.sendAttempted}
                                            options={paymentMethod.getInstallments} 
                                            placeholder="Cantidad de cuotas" 
                                            defaultValue={null}
                                            action={(value) => paymentMethod.setInstallmentsFromOptions(value)} />
                                    </Input> : null
                                }
                            </div>
                            {
                                installments && paymentInfo ?
                                <div className="payment-method__summary">
                                    <div className="payment-method__installment-summary">
                                    {paymentMethod.firstInstallment ? 
                                    <span>1 cuota de ARS {formatPrice(!this.props.assistcard.selectedProduct?paymentMethod.firstInstallment:paymentMethod.paymentInfo.dueValueWithAssistance)} + {installments - 1} cuotas de ARS {formatPrice(paymentMethod.installmentPrice)}</span>
                                    :
                                    <span>{installments} cuota{installments>1?'s':''} de ARS {installmentPrice}</span>
                                    }
                                    </div>
                                    <div className="payment-method__financial-costs">
                                        <div className="payment-method__financial-costs--interests">Intereses: ARS {formatPrice(paymentInfo.interest)} - TEA: {paymentInfo.tea} %</div>
                                        <div className="payment-method__financial-costs--cft">CFT: {isNaN(paymentInfo.cft) ? paymentInfo.cft : `${paymentInfo.cft} %`}</div>
                                    </div>
                                </div> : null
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PaymentType;