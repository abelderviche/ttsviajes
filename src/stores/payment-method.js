import { action, observable, computed, toJS } from 'mobx';

import ApiClient from './api-client';
import ENV from 'config';
import { validator } from './validators';
import CheckoutForm from './checkout-form';
import AssistCard from './assist-card';
import Reservations from './reservations'


const round = (num) => {
    if (!num) return 0.0;
    return Math.round(num * 100) / 100.0;
}

const addOrPushPromo = (list, bcracode, name, order, promo, maxInstallments, segment) => {
    const prevBank = list.find(wi => wi.bankCode === bcracode && (!segment || wi.segment === segment));
    if (!prevBank) {
        list.push({
            bankCode: bcracode,
            bankName: name,
            segment: segment,
            order: order,
            maxInstallments: maxInstallments,
            promos: [ promo ]
        })
    } else {
        const prevPromo = prevBank.promos.find(p => p.installments === promo.installments && p.interestRate === promo.interestRate);
        if (prevPromo) {
            if (!prevPromo.creditCards.some(cc => cc.cardCode === promo.creditCards[0].cardCode)) {
                prevPromo.creditCards.push(promo.creditCards[0]);
            }
        } else {
            prevBank.promos.push(promo);
        }
        prevBank.promos.sort((a, b) => a.installments - b.installments);
    }
}

const flattenResponse = (paymentMethods, addedPrice) => {
    /** Guardar en una variable del store de otherproducts, el valor en pesos, y sumarlo al total. (totalAcobrar) */
    const withInterest = [];
    const withoutInterest = [];
    const hsbc = [];
    if (paymentMethods) {
        paymentMethods.forEach(creditCardObj => {
            const { isocode, creditCard, entities } = creditCardObj;
            entities.forEach(bank => {
                const { name, bcracode, order, paymentMethod } = bank;
                paymentMethod.forEach(method => {
                    const { Segment, financing, maxCuota } = method;
                    financing.forEach(promo => {
                      /*  if(promo.InitialDue && Number(promo.dues) > 1){
                            if( promo.pricing.FEE > 0 || addedPrice>0){
                                parseFloat(promo.pricing.FEE + promo.pricing.dueValue + addedPrice).toFixed(2);
                            }
                            
                        }*/
                        const firstInstallment = promo.InitialDue && Number(promo.dues) > 1 && ( promo.pricing.FEE > 0 || addedPrice>0) ? parseFloat(promo.pricing.FEE + promo.pricing.dueValue + addedPrice).toFixed(2) : 0;
                        const bankPromo = {
                            installments: Number(promo.dues),
                            interestRate: parseFloat(promo.interest).toFixed(2),
                            totalInterest: round(promo.pricing.InterestAmount),
                            installmentCost: round((promo.pricing.dueValue + (promo.InitialDue && Number(promo.dues)?(Number(promo.dues) === 1 ? (promo.pricing.FEE + addedPrice) : 0):(addedPrice/promo.dues)))),
                            firstInstallment: firstInstallment,
                            fare: round(promo.pricing.TotalFare),
                            fee: round(promo.pricing.FEE),
                            total: round(promo.pricing.totalACobrar + addedPrice),
                            testing:addedPrice,
                            cft: promo.cftn,
                            tea: parseFloat(promo.tea).toFixed(2),
                            bines: promo.bines,
                            initialDue:promo.InitialDue,
                            creditCards: [{
                                cardCode: isocode,
                                cardName: creditCard,
                                paymentMethodId: promo.Id
                            }]
                        };                        
                        if (!promo.pricing.InterestAmount) {
                            if (bcracode === '150') {
                                const decoratedSegment = Segment ? Segment.toLowerCase().split(' ').map(a => a[0].toUpperCase() + a.slice(1)).join(' ') : '';
                                addOrPushPromo(hsbc, bcracode, name, order, bankPromo, maxCuota, decoratedSegment);
                            } else {
                                addOrPushPromo(withoutInterest, bcracode, name, order, bankPromo, maxCuota);
                            }
                        } else {
                            addOrPushPromo(withInterest, bcracode, name, order, bankPromo, maxCuota);
                        }
                    });
                });
            });
        });
    }
    const sortFunction = (a, b) => a.order - b.order;
    return {
        withInterest: withInterest.sort(sortFunction),
        withoutInterest: withoutInterest.sort(sortFunction),
        hsbc: hsbc
    };
}

const addOrPushBines = (list,creditcard,dues,bines) =>{
    const prevCCBin = list.find(cc=>cc.card === creditcard && cc.dues === dues);
    if(!prevCCBin){
        list.push({
            card: creditcard,
            dues: dues,
            bines:bines 
        })
    }else{
      list.find(cc=>cc.card === creditcard && cc.dues === dues).bines = list.find(cc=>cc.card === creditcard && cc.dues === dues).bines.concat(toJS(bines));
    }
}

const flattenResponseRewards = (paymentMethods, addedPrice) => {
    const withInterest = [];
    const withoutInterest = [];
    const hsbc = [];
    const binesList = [];
    if (paymentMethods) {
        paymentMethods.forEach(creditCardObj => {
            const { isocode, creditCard, entities } = creditCardObj;
              entities.forEach(bank => {
                if(bank.bcracode === "150"){
                    const { name, bcracode, order, paymentMethod } = bank;
                    bank.paymentMethod.forEach(method =>{
                        const { Segment, financing, maxCuota } = method;
                        financing.forEach(promo => {
                            addOrPushBines(binesList,isocode,promo.dues,promo.bines)
                        })
                    })
                    bank.paymentMethod[0].financing.forEach(promo=>{
                        const firstInstallment = promo.InitialDue && Number(promo.dues) > 1 && ( promo.pricing.FEE > 0 || addedPrice>0) ? parseFloat(promo.pricing.FEE + promo.pricing.dueValue + addedPrice).toFixed(2) : 0;
                        const bankPromo = {
                            installments: Number(promo.dues),
                            interestRate: parseFloat(promo.interest).toFixed(2),
                            totalInterest: round(promo.pricing.InterestAmount),
                            installmentCost: round((promo.pricing.dueValue + (promo.InitialDue && Number(promo.dues)?(Number(promo.dues) === 1 ? (promo.pricing.FEE + addedPrice) : 0):(addedPrice/promo.dues)))),
                            firstInstallment: firstInstallment,
                            fare: round(promo.pricing.TotalFare),
                            fee: round(promo.pricing.FEE),
                            total: round(promo.pricing.totalACobrar + addedPrice),
                            testing:addedPrice,
                            cft: promo.cftn,
                            remainder:promo.pricing.remainder,
                            rateAndFee:promo.pricing.remainder,
                            tea: parseFloat(promo.tea).toFixed(2),
                            //bines: promo.bines,
                            bines: binesList.find(b=>b.card === isocode && b.dues === promo.dues).bines,
                            initialDue:promo.InitialDue,
                            creditCards: [{
                                cardCode: isocode,
                                cardName: creditCard,
                                paymentMethodId: promo.id
                            }]
                        };  
                        addOrPushPromo(hsbc, isocode, creditCard, order, bankPromo, 12);

                    })
                }
            });
        });
    }
    const sortFunction = (a, b) => a.order - b.order;
    return {
        withInterest: withInterest.sort(sortFunction),
        withoutInterest: withoutInterest.sort(sortFunction),
        hsbc: hsbc
    };
}

class PaymentMethodStore {
    @observable paymentMethods = {};
    @observable OGPaymentsMethods = {};

    @observable installmentOptions = [];
    @observable checkoutId;
    @observable methodGroup;
    @observable selectedPromos;
    @observable bank;
    @observable creditCard;
    @observable installments;
    @observable pureCreditCard = false;

    @observable paymentInfo;

    @computed get loaded() {
        const { withInterest, withoutInterest, hsbc } = this.paymentMethods;
        return withInterest || withoutInterest || hsbc;
    }

    @action retrievePaymentMethods = (reservationId, typeProduct) => {
        let url = typeProduct.product_name==='FLIGHT'?ENV.CHECKOUT.PAYMENT_METHODS:ENV.CHECKOUT.PAYMENT_METHODS_HOTEL;
        let headers = ENV.CHECKOUT.REQUEST_HEADERS;
        headers['Product'] = typeProduct.translate_plural;
        headers['sourcegds'] = Reservations.product.source;
        return new Promise((resolve, reject) => {
            ApiClient.post(url, {
                'idbasset': reservationId,
                'ip': '127.0.0.1'
            }, {
                headers: headers
            }).then(
                res => {
                    const { CheckoutStrategies, CheckoutId } = res.data.Body;
                    this.checkoutId = CheckoutId;
                    if (CheckoutStrategies.CreditsCards && CheckoutStrategies.OnlineCollect) {
                        this.OGPaymentsMethods = CheckoutStrategies.CreditsCards.PaymentMethods;
                        this.paymentMethods = flattenResponse(this.OGPaymentsMethods,0);
                        this.paymentMethods = flattenResponseRewards(this.OGPaymentsMethods,0);

                        resolve();
                    } else {
                        reject(res.status)
                    }
                }
            ).catch(_ => reject());
        });
    }

    @action setPaymentMethods(paymentMethods,rewards){
    /*    const { CheckoutStrategies, CheckoutId } = res.data.Body;
        this.checkoutId = CheckoutId;*/
        this.OGPaymentsMethods = paymentMethods;
     //  console.log(flattenResponseRewards(this.OGPaymentsMethods,0));
        if(rewards){
            this.paymentMethods = flattenResponseRewards(this.OGPaymentsMethods,0);
        }else{
            this.paymentMethods = flattenResponse(this.OGPaymentsMethods,0);
        }
    }

    @action updatePaymentMethodBank(precio){
        if(this.bank){
            this.bank.promos =  this.bank.promos.map(p=>{
    
                var tmpPromo = p;
                tmpPromo['total'] = p.total+precio;
                tmpPromo['installmentCost'] = p.installmentCost + (precio/p.installments);
                return tmpPromo;
            })
        }
    }
    
    @action updatePaymentMethods = (price) => {
        this.paymentMethods = flattenResponse(this.OGPaymentsMethods,price);
       // this.updatePaymentMethodBank()
     //   this.resetSelections();
    }

    @action resetSelections = () => {
        this.bank = undefined;
        this.creditCard = undefined;
        this.installments = null;
        this.paymentInfo = undefined;
        this.paymentMethodId= undefined;
        this.installmentOptions = [];
    }

    @action setInstallmentOptions = () => {
        const options = [];
        if (this.bank && this.creditCard){
            const { promos } = this.bank;
            const { cardCode } = this.creditCard;
            promos.forEach(p => {
                const selectedCard = p.creditCards.find(cc => cc.cardCode === cardCode);
                if (selectedCard) {
                      options.push({
                        installments: { label: `${p.installments} cuota${p.installments>1?'s':''}`, value: p.installments },
                        paymentInfo: {
                            fare: p.fare,
                            fee: p.fee,
                            total: p.total,
                            interest: p.totalInterest,
                            tea: p.tea,
                            cft: p.cft,
                            rate: p.interestRate,
                            installments: p.installments,
                            installmentPrice: p.installmentCost,
                            firstInstallment: p.firstInstallment ,
                            paymentMethodId: selectedCard.paymentMethodId,
                            bines: p.bines,
                        }
                    })
                }
            });
        }
        this.installmentOptions = options;
    }

    @action setBank = (bank) => {
        if (this.bank && this.bank.bankCode !== bank.bankCode && this.bank.segment !== bank.segment) {
            this.creditCard = undefined;
        }
        this.bank = bank;
        this.bankOptions = [{
            label: bank.bankCode,
            value: bank.bankName
        }];
    }

    @action setCreditCard = (creditCard) => {
        this.creditCard = creditCard;
        this.creditCardOptions = [{
            label: creditCard.cardCode,
            value: creditCard.cardName
        }];
        if (this.bank && creditCard.cardCode === this.bank.bankCode) {
            this.pureCreditCard = true;
        } else {
            this.pureCreditCard = false;
        }
        CheckoutForm.resetCreditCardInfo();
    }

    @action setInstallments = (installments) => {
        this.installments = installments;
    }

    @action setInstallmentsFromOptions = (installments) => {
        const option = this.installmentOptions.find(inst => inst.installments.value === installments);
        this.selectInstallmentsOption(option);
    }

    @action selectInstallmentsOption = (option) => {
        if (option) {
            this.installments = option.installments.value;
            this.setPaymentInfo(option.paymentInfo);
            this.setPaymentMethodId(option.paymentInfo.paymentMethodId);
        } else {
            this.paymentInfo = {};
            this.paymentMethodId = null;
            this.installments = null;
        }
    }

    @action setPaymentInfo = (paymentInfo) => {
        this.paymentInfo = paymentInfo;
    }

    @action setPaymentMethodId = (id) => {
        this.paymentMethodId = id;
    }

    @action setMethodGroup= (id) => {
        this.methodGroup = id;
    }

    @action setSelectedPromos= (promos) => {
        this.selectedPromos = promos;
    }

    @action updateSelectedPromos= (add) => {
        let newSelectedPromo = [];
        if(this.selectedPromos){

            if(add){
                newSelectedPromo = this.selectedPromos.map(promo =>{
                    let firstInstallment = promo.initialDue && Number(promo.installments) > 1 && ( promo.fee > 0 || AssistCard.selectedProduct.amount>0)? parseFloat(promo.fee + promo.installmentCost +  AssistCard.selectedProduct.amount).toFixed(2):0;
                    // const firstInstallment = promo.InitialDue && Number(promo.dues) > 1 && promo.pricing.FEE > 0 ? parseFloat(promo.pricing.FEE + promo.pricing.dueValue + addedPrice).toFixed(2) : 0;
                    let newPromo = promo;

                  //  const firstInstallment = promo.InitialDue && Number(promo.dues) > 1 && ( promo.pricing.FEE > 0 || addedPrice>0) ? parseFloat(promo.pricing.FEE + promo.pricing.dueValue + AssistCard.selectedProduct.amount).toFixed(2) : 0;
                    //  installmentCost: round((promo.installmentCost + (promo.InitialDue && Number(promo.dues)?(Number(promo.dues) === 1 ? (promo.pricing.FEE + addedPrice) : 0):(addedPrice/promo.dues)))),
                    
                    newPromo.total = promo.total +  AssistCard.selectedProduct.amount;
                    newPromo.firstInstallment = firstInstallment;
                    newPromo.installmentCost = firstInstallment > 0 ? parseFloat(promo.installmentCost) :  promo.installmentCost +  AssistCard.selectedProduct.amount;
                    /*
                    newPromo.total = promo.total +  AssistCard.selectedProduct.amount;
                    newPromo.firstInstallment = promo.firstInstallment > 0 ? parseFloat(promo.firstInstallment) +AssistCard.selectedProduct.amount : 0;
                    newPromo.installmentCost = promo.firstInstallment > 0 ? parseFloat(promo.installmentCost) :  promo.installmentCost +  AssistCard.selectedProduct.amount;
                    */
                    return newPromo;
                });
                if(this.paymentInfo){
                    let firstInstallment    =   this.paymentInfo.initialDue && Number(this.paymentInfo.installments) > 1 ?parseFloat( this.paymentInfo.fee + this.paymentInfo.installmentPrice + AssistCard.selectedProduct.amount).toFixed(2):0; 
                    let installmentCost     =   firstInstallment>0?round((this.paymentInfo.installmentPrice  + (this.paymentInfo.initialDue  && Number(this.paymentInfo.installments)?(Number(this.paymentInfo.installments) === 1 ? (this.paymentInfo.fee + AssistCard.selectedProduct.amount) : 0):(AssistCard.selectedProduct.amount/this.paymentInfo.installments)))):round(this.paymentInfo.installmentPrice + AssistCard.selectedProduct.amount);
                    
                    this.paymentInfo.total = this.paymentInfo.total +  AssistCard.selectedProduct.amount;
                    this.paymentInfo.firstInstallment  = firstInstallment;
                    this.paymentInfo.installmentPrice = installmentCost;
                    /* 
                    this.paymentInfo.firstInstallment = this.paymentInfo.firstInstallment > 0 ? parseFloat(this.paymentInfo.firstInstallment) +AssistCard.selectedProduct.amount : 0;
                    this.paymentInfo.installmentPrice = this.paymentInfo.firstInstallment > 0 ? parseFloat(this.paymentInfo.installmentPrice) :  this.paymentInfo.installmentPrice +  AssistCard.selectedProduct.amount;
                    */
                }
            }else{
                newSelectedPromo = this.selectedPromos.map(promo =>{
                    // const firstInstallment = promo.InitialDue && Number(promo.dues) > 1 && promo.pricing.FEE > 0 ? parseFloat(promo.pricing.FEE + promo.pricing.dueValue + addedPrice).toFixed(2) : 0;
                    let newPromo = promo;
                    //  installmentCost: round((promo.installmentCost + (promo.InitialDue && Number(promo.dues)?(Number(promo.dues) === 1 ? (promo.pricing.FEE + addedPrice) : 0):(addedPrice/promo.dues)))),
                    newPromo.total = promo.total -  AssistCard.selectedProduct.amount;
                    //newPromo.firstInstallment = promo.firstInstallment > 0 ? promo.firstInstallmentpromo.installmentCost?0:parseFloat(promo.firstInstallment) - AssistCard.selectedProduct.amount : 0;
                    if(promo.firstInstallment > 0){
            
            
                        if(round(parseFloat(promo.firstInstallment) - AssistCard.selectedProduct.amount) === promo.installmentCost){
                            newPromo.firstInstallment = 0;
                        }else{
                            newPromo.firstInstallment = parseFloat(promo.firstInstallment) - AssistCard.selectedProduct.amount;
                        }
                        newPromo.installmentCost = parseFloat(promo.installmentCost);
                    }else{
                        newPromo.firstInstallment = 0;
                        newPromo.installmentCost =  promo.installmentCost - AssistCard.selectedProduct.amount;
                    }
                   // newPromo.installmentCost = promo.firstInstallment > 0 ? parseFloat(promo.installmentCost) :  promo.installmentCost - AssistCard.selectedProduct.amount;
                    return newPromo;
                })

                if(this.paymentInfo){
                    this.paymentInfo.total = this.paymentInfo.total -  AssistCard.selectedProduct.amount;
                    if(this.paymentInfo.firstInstallment > 0){
                        if((round(parseFloat(this.paymentInfo.firstInstallment) -AssistCard.selectedProduct.amount)) === this.paymentInfo.installmentPrice ){
                            this.paymentInfo.firstInstallment = 0;
                            this.paymentInfo.installmentPrice = this.paymentInfo.installmentPrice;
                        }else{
                            this.paymentInfo.firstInstallment = parseFloat(this.paymentInfo.firstInstallment) -AssistCard.selectedProduct.amount;
                            this.paymentInfo.installmentPrice = this.paymentInfo.installmentPrice ;
                        }
                    }else{
                        this.paymentInfo.firstInstallment = 0;
                        this.paymentInfo.installmentPrice = this.paymentInfo.installmentPrice - AssistCard.selectedProduct.amount;
                        
                    }
                  //  this.paymentInfo.firstInstallment = this.paymentInfo.firstInstallment > 0 ? (parseFloat(this.paymentInfo.firstInstallment) -AssistCard.selectedProduct.amount) : 0;
                
                }
            }
            this.selectedPromos = newSelectedPromo;
        }
            
    }


    @computed get installmentPrice() {
        return this.paymentInfo ? round(this.paymentInfo.installmentPrice) : 0;
    }

    @computed get firstInstallment() {
        return this.paymentInfo ? this.paymentInfo.firstInstallment : 0;
    }

    @computed get validPaymentMethod() {
        return this.installments && this.paymentMethodId && this.bank && this.creditCard;
    }

    @computed get validInstallments() {
        return validator(this.installments, { required: true });
    }

    @computed get getInstallments(){
        return this.installmentOptions.map(inst => inst.installments)
    }
}

export default new PaymentMethodStore();
