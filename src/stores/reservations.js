import { action, observable, computed } from 'mobx';

import ApiClient from './api-client';
import ENV from 'config';

import PaymentMethodStore from './payment-method';
import CheckoutFormStore from './checkout-form';
import AssistCard from './assist-card';
import BillingStore from './billing';
const getTypeProduct = (typeProduct) =>{
    let typeProductObj = {};
    switch (typeProduct) {
        case 'FLIGHT':
            typeProductObj = {
                'product_name':typeProduct,
                'translate_singular':'vuelo',
                'translate_plural':'vuelos'
            }
            break;
        case 'ACCOMMODATION':
            typeProductObj = {
                'product_name':typeProduct,
                'translate_singular':'hotel',
                'translate_plural':'hoteles'
            }
            break;
        default:
            typeProductObj = {
                'product_name':typeProduct,
                'translate_singular':typeProduct,
                'translate_plural':typeProduct
            }
            break;
    }
    return typeProductObj;
}
class ReservationsStore {
    @observable reservation;
    @observable product;
    @observable typeProduct;

    @computed get thanksLink() {
        return this.reservation ? ENV.CHECKOUT.THANKS.replace('{id}', this.reservation.id) : '';
    }

    @action paymentMethodsErrorNotice = () => {
        return new Promise((resolve, reject) => {
            let data;
            if(BillingStore.validFields && !this.product.fiscal_data){
                data = {
                    "idBasset": this.reservation.id,
                    "nombreReserva": BillingStore.fiscalName,
                    "situacionFiscal": BillingStore.cuitType,
                    "cuitCuil": BillingStore.fiscalIdType,
                    "cuitCuilNumber": BillingStore.cuit,
                    "provincia": BillingStore.state,
                    "ciudad": BillingStore.city,
                    "calle": BillingStore.street,
                    "numero": Number(BillingStore.number),
                    "piso": isNaN(BillingStore.floor) ? 0 : BillingStore.floor,
                    "dpto": BillingStore.apt ? BillingStore.apt : '',
                    "codPostal": BillingStore.zipCode,
                    "codReserva": this.product.pnr?this.product.pnr:this.reservation.id,
                    "email": this.reservation.contact.email,
                    "phone": this.reservation.contact.telephone ? this.reservation.contact.telephone : null,
                    "tipoProducto":this.typeProduct.product_name
                };
            }else{
                data = {
                    "idBasset": this.reservation.id,
                    "nombreReserva": this.reservation.fiscal_data.identification.fiscal_name,
                    "situacionFiscal": this.reservation.fiscal_data.identification.tax_situation,
                    "cuitCuil": this.reservation.fiscal_data.identification.type,
                    "cuitCuilNumber": this.reservation.fiscal_data.identification.number,
                    "provincia": this.reservation.fiscal_data.address.state,
                    "ciudad": this.reservation.fiscal_data.address.city,
                    "calle": this.reservation.fiscal_data.address.street,
                    "numero": Number(this.reservation.fiscal_data.address.number),
                    "piso": isNaN(this.reservation.fiscal_data.address.floor) ? 0 : this.reservation.fiscal_data.address.floor,
                    "dpto": this.reservation.fiscal_data.address.door ? this.reservation.fiscal_data.address.door : '',
                    "codPostal": this.reservation.fiscal_data.address.postal_code,
                    "codReserva": this.product.pnr?this.product.pnr:this.reservation.id,
                    "email": this.reservation.contact.email,
                    "phone": this.reservation.contact.telephone ? this.reservation.contact.telephone : null,
                    "tipoProducto":this.typeProduct.product_name
                };
            }
            if (data) {
                ApiClient.post(ENV.CHECKOUT.PM_FALLBACK, data).then(
                    res => resolve(res.data)
                ).catch(
                    err => reject(err)
                )
            } else {
                reject({ invalidFields: true });
            }
        });
    }

    @action doPayment = () => {
        return new Promise((resolve, reject) => {
            const { paymentMethodId, checkoutId } = PaymentMethodStore;
            let data ;
            if (CheckoutFormStore.validFields && PaymentMethodStore.validPaymentMethod) {
                if(BillingStore.validFields && !this.product.fiscal_data){
                    data = {
                        "checkoutid": checkoutId,
                        "payment_method_type": "credito",
                        "SelectedPaymentMethodId": paymentMethodId,
                        "credit_card_data": {
                            "creditcardNumber": CheckoutFormStore.creditCardNumber,
                            "ExpirationDate": CheckoutFormStore.expirationDate,
                            "SecurityCode": CheckoutFormStore.securityCode,
                            "CreditCardHolderName": CheckoutFormStore.cardholderName,
                            "Token": null,
                            "TypeCard": "Credit"
                        },
                        "billingData": {
                            "payerName": BillingStore.fiscalName,
                            "PayerDniNumber": CheckoutFormStore.documentNumber,
                            "fiscalSituation": BillingStore.cuitType,
                            "typeDocument": BillingStore.fiscalIdType,
                            "fiscalNumber": BillingStore.cuit,
                            "country": "ARG",
                            "province": BillingStore.state,
                            "city": BillingStore.city,
                            "street": BillingStore.street,
                            "numberStreet": Number(BillingStore.number),
                            "floorDpto": isNaN(BillingStore.floor) ? 0 : BillingStore.floor,
                            "department": BillingStore.apt,
                            "postalCode": BillingStore.zipCode
                        }
                    }
                }else if(this.product.fiscal_data) {
                    data = {
                        "checkoutid": checkoutId,
                        "payment_method_type": "credito",
                        "SelectedPaymentMethodId": paymentMethodId,
                        "credit_card_data": {
                            "creditcardNumber": CheckoutFormStore.creditCardNumber,
                            "ExpirationDate": CheckoutFormStore.expirationDate,
                            "SecurityCode": CheckoutFormStore.securityCode,
                            "CreditCardHolderName": CheckoutFormStore.cardholderName,
                            "Token": null,
                            "TypeCard": "Credit"
                        },
                        "billingData": {
                            "payerName": this.reservation.fiscal_data.identification.fiscal_name,
                            "PayerDniNumber": CheckoutFormStore.documentNumber,
                            "fiscalSituation": this.reservation.fiscal_data.identification.tax_situation,
                            "typeDocument": this.reservation.fiscal_data.identification.type,
                            "fiscalNumber": this.reservation.fiscal_data.identification.number,
                            "country": "ARG",
                            "province": this.reservation.fiscal_data.address.state,
                            "city": this.reservation.fiscal_data.address.city,
                            "street": this.reservation.fiscal_data.address.street,
                            "numberStreet": Number(this.reservation.fiscal_data.address.number),
                            "floorDpto": isNaN(this.reservation.fiscal_data.address.floor) ? 0 : this.reservation.fiscal_data.address.floor,
                            "department": this.reservation.fiscal_data.address.door,
                            "postalCode": this.reservation.fiscal_data.address.postal_code
                        }
                    }
                }
            }
            const url = this.typeProduct.product_name === 'FLIGHT'?ENV.CHECKOUT.COLLECT:ENV.CHECKOUT.COLLECT_HOTEL;
            if(data){
                if(AssistCard.selectedProduct){
                    data['assistcardid']=AssistCard.selectedProduct.idAssistance;
                }
                let headers = ENV.CHECKOUT.REQUEST_HEADERS;
                headers['sourcegds'] = this.product.source;
                /*console.log('data',data);
                console.log('headers',headers);
                */
                  ApiClient.post(url, data, {
                    crossDomain: true,
                    headers: headers
                }).then(
                    res => resolve(res.data)
                ).catch(
                    err => reject(err)
                )
            } else {
                reject({ invalidFields: true });
            }
        });
    }
    
    @action retrieveReservation = (id) => {
        return new Promise((resolve, reject) => {
            ApiClient.get(ENV.CHECKOUT.RETRIEVE_RESERVATION.replace('{id}', id), { 
                crossDomain: true,
                headers: {
                  'x-api-key': ENV.BASSET.API_KEY,
                  'x-client-id': ENV.BASSET.CLIENT_ID
                }
            }).then(
                response => {
                    const { data } = response;
                    this.reservation = data;
                    const productReservation = this.reservation.products.find(p => (p.type === 'FLIGHT'|| p.type==='ACCOMMODATION'))
                    if (productReservation) {
                        this.typeProduct = getTypeProduct(this.reservation.products[0].type);
                        this.retrieveProductReservation(productReservation.reservation_id,this.typeProduct.product_name).then(
                            (res) => {
                                resolve({
                                    reservation: this.reservation,
                                    typeProduct: this.typeProduct,
                                    product: res
                                })
                            },
                            (err) => reject(err)
                        );
                    } else {
                        reject("Flight not found");
                    }
                }
            ).catch(error => reject(error));
        });
    }

    @action retrieveProductReservation = (id,product_type) => {
        let url = product_type==='FLIGHT'?ENV.CHECKOUT.RETRIEVE_RESERVATION_PRODUCT:ENV.CHECKOUT.RETRIEVE_RESERVATION_PRODUCT_HOTEL;
        return new Promise((resolve, reject) => {
            ApiClient.get(url.replace('{id}', id), {
                crossDomain: true,
                headers: {
                  'x-api-key': ENV.BASSET.API_KEY,
                  'x-client-id': ENV.BASSET.CLIENT_ID
                }
            }).then(
                response => {
                    this.product = response.data;
                    resolve(this.product);
                }
            ).catch(error => reject(error));
        })
    }
}

export default new ReservationsStore();
