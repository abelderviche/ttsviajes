import { action, observable, computed,toJS } from 'mobx';
import Cookies from 'js-cookie';

import ApiClient from './api-client';
import ENV from 'config';
import { validator } from './validators';
import CheckoutForm from './checkout-form';
import AssistCard from './assist-card';
import Reservations from './reservations'
import PaymentMethodStore from './payment-method'
import Contact from './contact-form'
import BillingStore from './billing'
import GuestsStore from './guests'
import CheckoutFormStore from './checkout-form'


class CheckoutStore {
    @observable activeComponents = [];
    @observable infoProduct = {};
    @observable points = null;
    @observable isRewards = false;
    @observable entityBank = false;
    @observable termAndConditions = false;
    @observable clusterID = '';
    @observable trackID = '';
    @observable loginHash = null;
    
    

    @action setTermAndConditions = (TandCInput) => {
        this.termAndConditions = TandCInput.target.checked;
    }

    @action retrieveCheckoutInfo = (clusterID, product,idGetPoints,points) => {
        let headers = ENV.CHECKOUT.REQUEST_HEADERS;
        this.entityBank = headers.subchannel.search('hsbc') >= 0? true:false;

        //console.log(Cookies.get('ID-TTS-R'))
        this.loginHash = Cookies.get('ID-TTS-R');

       /* headers['Product'] = typeProduct.translate_plural;
        headers['sourcegds'] = Reservations.product.source;*/
        let reqBody = {
            clusterId:clusterID,
            product:product,
        }
        if(idGetPoints && points){
            reqBody['selPoints'] = points;
            reqBody['idGetPoints'] = idGetPoints;
        }
        return new Promise((resolve, reject) => {
            ApiClient.post(ENV.CHECKOUT.GETINFO, reqBody, {
                headers: headers
            }).then(
                res => {
                    if(res.data){
                    let { action, message, data } = res.data;
                    let { fcb,activeComponents, infoProduct, clusterId,trackId, ascs} = data;
                    this.clusterID = clusterId;
                    this.trackID = trackId;
                    switch (action) {
                            case '1':   
                                this.activeComponents = activeComponents;
                                this.infoProduct = infoProduct;
                                this.isRewards = data.points.isRewards;
                                this.points =  data.points.numPoint;
                                if(fcb.financing.creditsCards.enabled){
                                    PaymentMethodStore.setPaymentMethods(fcb.financing.creditsCards.paymentMethods, this.entityBank);
                                }
                                
                                if(ascs){
                                    AssistCard.setProducts(ascs.products);
                                }
                                if(product==='flights'){
                                    GuestsStore.setPaxArray(data.paxf, data.paxf.every(GuestsStore.validPax));
                                }else if(product ==='accommodations'){
                                    GuestsStore.setGuestArray(data.paxa, data.paxa.every(GuestsStore.validGuest));
                                }
                               // if(this.entityBank){
                                    const promo = PaymentMethodStore.paymentMethods.hsbc[0].promos[0];
                                   PaymentMethodStore.setPaymentInfo({
                                        fare: promo.fare,
                                        fee: promo.fee,
                                        rateAndFee: promo.rateAndFee,
                                        remainder: promo.remainder,
                                        total: promo.total,
                                        interest: promo.totalInterest,
                                        tea: promo.tea,
                                        cft: promo.cft,
                                        rate: promo.interestRate,
                                        installments: promo.installments,
                                        installmentPrice: promo.installmentCost,
                                        firstInstallment: promo.firstInstallment,
                                        bines: promo.bines,
                                        totalWithAssistance:promo.totalWithAssistance,
                                        dueValueWithAssistance:promo.dueValueWithAssistance,
                                        initialDue: promo.initialDue,
                                    });
                                   PaymentMethodStore.setInstallments(promo.installments);
                             //  }
                                resolve(
                                    {   action:action,
                                        message:'ok'
                                    }
                                );
                                break;
                            case '2':
                                resolve(
                                    {   action:action,
                                        message:message,
                                        url:data
                                    }
                                );
                                break;
                            case '3':
                                resolve(
                                    {   action:action,
                                        message:message,
                                        url:data
                                    }
                                );
                                break;
                            default:
                                resolve(
                                    {   action:action,
                                        message:'nok'
                                    }
                                );
                                break;
                        }
                                
                    }else{
                        reject();
                    }
                   /* const { CheckoutStrategies, CheckoutId } = res.data.Body;
                    this.checkoutId = CheckoutId;
                    if (CheckoutStrategies.CreditsCards && CheckoutStrategies.OnlineCollect) {
                        this.OGPaymentsMethods = CheckoutStrategies.CreditsCards.PaymentMethods;
                        this.paymentMethods = flattenResponse(this.OGPaymentsMethods,0);
                        resolve();
                    } else {
                        reject(res.status)
                    }*/
                }
            ).catch(e => {console.log(e); reject()});
        });
    }

    @action doPayment = () =>{
        return new Promise((resolve, reject) => {

            console.log('BillingStore',BillingStore.validFields)
            console.log('paymentmethod',PaymentMethodStore.paymentMethodId)
            console.log('CheckoutFormStore', CheckoutFormStore.validFields);
            console.log('Contact',Contact.validFields)
            console.log('GuestsStore', GuestsStore.validFields);

            let AC = this.activeComponents.map(ac=>ac.name);
            
            if(this.termAndConditions 
                && (AC.indexOf('FCB')>=0?(BillingStore.validFields && (PaymentMethodStore.paymentMethodId>=0 && CheckoutFormStore.validFields)):true) 
                && (AC.indexOf('CONT')>=0? Contact.validFields:true)
                && (AC.indexOf('PAXA')>=0||AC.indexOf('PAXF')>=0?GuestsStore.validFields:true)
                ){
                    //if(true){
                        // cambiar telefono 
                let body = {
                    trackId: this.trackID,
                    clusterId: this.clusterID,
                    product: this.infoProduct.type,
                    loginHash : this.loginHash,
                    datacomponent:{
                        activeComponents:toJS(this.activeComponents),
                        fcb:{
                            financing:null,
                            billingData:{
                                fiscalData:{
                                    address: {
                                        state: BillingStore.state,
                                        city: BillingStore.city,
                                        country: "ARG",
                                        street: BillingStore.street,
                                        number: BillingStore.number,
                                        floor:  BillingStore.floor,
                                        door:  BillingStore.apt,
                                        postalCode: BillingStore.zipCode,
                                        phone: 1511111111
                                    },
                                    identification: {
                                        number: BillingStore.cuit,
                                        fiscalName: BillingStore.fiscalName,
                                        type: BillingStore.fiscalIdType,
                                        taxSituation: BillingStore.cuitType,
                                        email: Contact.email
                                    }
                                }
                            },
                            cardsData:[]
                        },
                        cont: {
                            email: Contact.email,
                            language: "es",
                            telephone: {
                                type: Contact.phoneType,
                                countryCode: Contact.countryCode.replace(/^0+/, ''),
                                areaCode: Contact.areaCode.replace(/^0+/, ''),
                                number: Contact.phoneNumber
                            }
                        }
                    }
                }

                if(this.infoProduct.type==='accommodations'){
                    body.datacomponent.paxA = toJS(GuestsStore.guestsArray);
                }else{
                    body.datacomponent.paxF = toJS(GuestsStore.paxArray);
                }

                if(PaymentMethodStore.paymentMethodId >= 0){
                    body.datacomponent.fcb.financing = {selectedPaymentMethodId:PaymentMethodStore.paymentMethodId};
                    body.datacomponent.fcb.cardsData[0] = {
                        creditCardNumber: CheckoutFormStore.creditCardNumber,
                        expirationDate: CheckoutFormStore.expirationDate,
                        securityCode: CheckoutFormStore.securityCode,
                        creditCardHolderName: CheckoutFormStore.cardholderName,
                        typeCard: "Credit"
                    }
                }

                console.log('urldotransaction',ENV.CHECKOUT.DO_TRANSACTION)
                console.log('DoTransactionBody',body);
                console.log('DoRequestHeaders',ENV.CHECKOUT.REQUEST_HEADERS);


                
                ApiClient.post(ENV.CHECKOUT.DO_TRANSACTION, body, {
                    headers: ENV.CHECKOUT.REQUEST_HEADERS
                }).then( res => {
                        console.log("respuesta do transaction", res);
                        resolve(res.data);   
                }).catch(
                    err => reject(err)
                )
            }else{
                reject({ invalidFields: true });
            } 
        });
    }
}

export default new CheckoutStore();
