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


class CheckoutStore {
    @observable activeComponents = [];
    @observable infoProduct = {};
    
    @action retrieveCheckoutInfo = (clusterID, product,trackID) => {
        let headers = ENV.CHECKOUT.REQUEST_HEADERS;
       /* headers['Product'] = typeProduct.translate_plural;
        headers['sourcegds'] = Reservations.product.source;*/
        
        return new Promise((resolve, reject) => {
            ApiClient.post(ENV.CHECKOUT.GETINFO, {
                'idbasset': 123123,
                'ip': '127.0.0.1',
                'clusterid':clusterID,
                'product':product,
                'trackID':null
            }, {
                headers: headers
            }).then(
                res => {
                    console.log(res)
                    if(res.data){
                     //   console.log(res.data.data);
                        let { action, fcb,activeComponents,infoProduct} = res.data.data;
                        switch (action) {
                            case '1':   
                            this.activeComponents = activeComponents;
                                console.log('aasdasd',res.data.data);
                                this.infoProduct = infoProduct;
                                //PaymentMethodStore.setPaymentMethods(fcb.financing.creditsCards.paymentMethods);
                                if(product==='flights'){
                                    GuestsStore.setPaxArray(res.data.data.paxf);
                                }else if(product ==='accommodation'){
                                    GuestsStore.setGuestArray(res.data.data.paxa);
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
                                        message:'nok'
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
        
    }
}

export default new CheckoutStore();
