import { action, observable, computed } from 'mobx';

import ApiClient from './api-client';
import ENV from 'config';
import PaymentsMethods from './payment-method';

class AssistCardStore {
    //CROSSSELING_PRODS
    @observable availableProducts = [];

    @action retrieveProducts = (reservationId) => {
        let headers = ENV.CHECKOUT.REQUEST_HEADERS;
        return new Promise((resolve, reject) => {
            ApiClient.post(ENV.CROSSSELING_PRODS, {
                'idbasset': reservationId,
                'ip': '127.0.0.1'
            }, {
                headers: headers
            }).then(
                res => {
                    const { status, data } = res.data;
               //     this.checkoutId = CheckoutId;
                    if (status && data) {
                        this.availableProducts = data.products;
                        resolve();
                    } else {
                        reject(res.status)
                    }
                }
            ).catch(_ => reject());
        });
    }

    @observable selectedProduct = null;

    @action selectProduct = (value) => {
        this.selectedProduct = this.availableProducts[value];
        PaymentsMethods.updatePaymentMethods(this.selectedProduct.amount);
        if(PaymentsMethods.installmentOptions.length > 0){
            PaymentsMethods.updatePaymentMethodBank(this.selectedProduct.amount)
            PaymentsMethods.setInstallmentOptions();
        }
        PaymentsMethods.updateSelectedPromos(true);
    }
    @action removeProduct = () => {
        PaymentsMethods.updateSelectedPromos(false);
        PaymentsMethods.updatePaymentMethods(0);
        if(PaymentsMethods.installmentOptions.length > 0){
            PaymentsMethods.updatePaymentMethodBank(-1*this.selectedProduct.amount)
            PaymentsMethods.setInstallmentOptions();
        }
        this.selectedProduct = null;
    }

    @action getPaidProduct(reservationId,idSelected){
        return new Promise((resolve, reject) => {
            this.retrieveProducts(reservationId).then(
                ()=> {
                    resolve(true)
                },
                ()=>reject()
            )
            
        });

    }
}

export default new AssistCardStore();