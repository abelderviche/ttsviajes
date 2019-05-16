import { action, observable, computed } from 'mobx';

import ApiClient from './api-client';
import ENV from 'config';
import { validator } from './validators';
import CheckoutForm from './checkout-form';
import AssistCard from './assist-card';
import Reservations from './reservations'
import PaymentMethodStore from './payment-method'


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
                'ip': '127.0.0.1'
            }, {
                headers: headers
            }).then(
                res => {
                    if(res.data){
                        console.log(res.data);
                        let { action, fcb,activeComponents,infoProduct} = res.data;
                        switch (action) {
                            case '1':   
                                PaymentMethodStore.setPaymentMethods(fcb.creditsCards.paymentMethods);
                                this.activeComponents = activeComponents;
                                this.infoProduct = infoProduct;
                                
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
}

export default new CheckoutStore();
