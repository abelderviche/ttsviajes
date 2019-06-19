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
    
    @action retrieveCheckoutInfo = (clusterID, product,idGetPoints,points) => {
        let headers = ENV.CHECKOUT.REQUEST_HEADERS;
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
                    console.log(res)
                    if(res.data){
                     //   console.log(res.data.data);
                     let { action, message, data } = res.data;
                     let { fcb,activeComponents, infoProduct } = data;
                     switch (action) {
                            case '1':   
                            this.activeComponents = activeComponents;
                                this.infoProduct = infoProduct;
                                console.error(fcb.financing)
                                if(fcb.financing.creditsCards.enabled){
                                    PaymentMethodStore.setPaymentMethods(fcb.financing.creditsCards.paymentMethods);
                                }
                                if(product==='flights'){
                                    GuestsStore.setPaxArray(res.data.data.paxf, res.data.data.paxf.every(GuestsStore.validPax));
                                }else if(product ==='accommodations'){
                                    GuestsStore.setGuestArray(res.data.data.paxa, res.data.data.paxa.every(GuestsStore.validGuest));
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
            ).catch(_ => reject());
        });
    }

    @action doPayment = () =>{
        console.log('paymentmethod',PaymentMethodStore)
        console.log('BillingStore',BillingStore.validFields)
        console.log('Contact',Contact.validFields)
        console.log('GuestsStore', GuestsStore.validFields);
        console.log('CheckoutFormStore', CheckoutFormStore);

        console.log('payment',PaymentMethodStore)
     /*   if(BillingStore.validFields && Contact.validFields && GuestsStore.validFields 
        && (PaymentMethodStore.paymentMethodId>=0 && !CheckoutFormStore.validFields)){
*/
if(true){
        let body = {
            trackId: null,
            clusterId: null,
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

        console.log(body);

    }

       // if(BillingStore.pay)
        
        
    }
}

export default new CheckoutStore();
