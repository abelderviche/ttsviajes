import { action, observable, computed } from 'mobx';

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
    
    

    @action setTermAndConditions = (TandCInput) => {
        this.termAndConditions = TandCInput.target.checked;
    }

    @action retrieveCheckoutInfo = (clusterID, product,idGetPoints,points) => {
        let headers = ENV.CHECKOUT.REQUEST_HEADERS;
        this.entityBank = headers.subchannel.search('hsbc') >= 0? true:false;

       /* headers['Product'] = typeProduct.translate_plural;
        headers['sourcegds'] = Reservations.product.source;*/
        this.points = points;
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
                        console.log(res.data);
                     //   console.log(res.data.data);
                     let { action, message, data } = res.data;
                     let { fcb,activeComponents, infoProduct, clusterId,trackId} = data;
                     this.clusterID = clusterId;
                     this.trackID = trackId;
                     switch (action) {
                            case '1':   
                                this.activeComponents = activeComponents;
                                this.infoProduct = infoProduct;
                                this.isRewards = data.points.isRewards;
                                if(fcb.financing.creditsCards.enabled){
                                    PaymentMethodStore.setPaymentMethods(fcb.financing.creditsCards.paymentMethods, this.entityBank);
                                }
                                if(product==='flights'){
                                    GuestsStore.setPaxArray(data.paxf, data.paxf.every(GuestsStore.validPax));
                                }else if(product ==='accommodations'){
                                    GuestsStore.setGuestArray(data.paxa, data.paxa.every(GuestsStore.validGuest));
                                }
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
            ).catch(e => console.log(e));
        });
    }

    @action doPayment = () =>{
        return new Promise((resolve, reject) => {

           /* console.log('paymentmethod',PaymentMethodStore)
            console.log('BillingStore',BillingStore.validFields)
            console.log('Contact',Contact.validFields)
            console.log('GuestsStore', GuestsStore.validFields);
            console.log('CheckoutFormStore', CheckoutFormStore);

            console.log('payment',PaymentMethodStore)
            
            */
            let AC = this.activeComponents.map(ac=>ac.name);

            if(this.termAndConditions 
                && (AC.indexOf('FCB')>=0?(BillingStore.validFields && (PaymentMethodStore.paymentMethodId>=0 && CheckoutFormStore.validFields)):true) 
                && (AC.indexOf('CONT')>=0? Contact.validFields:true)
                && (AC.indexOf('PAXA')>=0||AC.indexOf('PAXF')>=0?GuestsStore.validFields:true)
                ){
                let body = {
                    trackId: this.clusterID,
                    clusterId: this.trackID,
                    activeComponents:this.activeComponents,
                    fcb:{
                        financing:null,
                        billingData:{
                            address: {
                                state: BillingStore.state,
                                city: BillingStore.city,
                                country: "AR",
                                street: BillingStore.street,
                                number: BillingStore.number,
                                floor:  BillingStore.floor,
                                door:  BillingStore.apt,
                                postal_code: BillingStore.zipCode
                            },
                            identification: {
                                number: BillingStore.cuit,
                                fiscalName: BillingStore.fiscalName,
                                type: BillingStore.fiscalIdType,
                                taxSituation: BillingStore.cuitType
                            }
                        },
                        cardData:null
                    },
                    cont: {
                        email: Contact.email,
                        language: "es",
                        telephone: {
                            type: Contact.phoneType,
                            country_code: Contact.countryCode,
                            area_code: Contact.areaCode,
                            number: Contact.phoneNumber
                        }
                    },
                }

                if(this.infoProduct.type==='accommodations'){
                    body.pax = GuestsStore.guestsArray;
                }else{
                    body.pax = GuestsStore.paxArray;
                }

                if(PaymentMethodStore.paymentMethodId >= 0){
                    body.fcb.financing = {selectedPaymentMethodId:PaymentMethodStore.paymentMethodId};
                    body.fcb.cardData = {
                        creditCardNumber: CheckoutFormStore.creditCardNumber,
                        expirationDate: CheckoutFormStore.expirationDate,
                        securityCode: CheckoutFormStore.securityCode,
                        creditCardHolderName: CheckoutFormStore.cardholderName,
                        typeCard: "Credit"
                    }
                }
                console.log('DoTransactionBody',body);
                
                ApiClient.post(ENV.CHECKOUT.DO_TRANSACTION, body, {
                    headers: ENV.CHECKOUT.REQUEST_HEADERS
                }).then( res => {
                    if(res.data){
                        console.log(res.data);
                        resolve(res.data);   
                    }else{
                        reject()
                    }
                 }
                    
                ).catch(e => console.log(e));
            }else{
                reject({ invalidFields: true });
            }
        });
    }
}

export default new CheckoutStore();
