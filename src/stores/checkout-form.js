import { action, observable, computed } from 'mobx';
import { validator } from './validators';
import PaymentMethod from './payment-method';
import moment from 'moment';

class CheckoutFormStore {
    @observable creditCardNumber = '';
    @observable securityCode = '';
    @observable expirationMonth = '';
    @observable expirationYear = '';

    @observable cardholderName = '';
    @observable documentType = 'DNI';
    @observable documentNumber = '';

    @computed get validFields() {
        return this.validCreditCardNumber.valid && this.validSecurityCode.valid 
            && this.validCardholderName.valid && this.validDocumentNumber.valid
            && this.validDocumentType.valid && this.validExpirationMonth.valid 
            && this.validExpirationYear.valid;
    }

    @computed get validCreditCardNumber() {
        const { paymentInfo, creditCard } = PaymentMethod;
        const cardCode = creditCard ? creditCard.cardCode : '';
        return validator(this.creditCardNumber, { 
            required: true, 
            creditCard: true, 
            bines: paymentInfo ? paymentInfo.bines : [],
            length: cardCode === 'AX' ? 15 : 16
        });
    }

    @computed get validSecurityCode() {
        const { creditCard } = PaymentMethod;
        const cardCode = creditCard ? creditCard.cardCode : '';
        return validator(this.securityCode, { length: cardCode === 'AX' ? 4 : 3, type: 'number' });
    }

    @computed get validCardholderName() {
        return validator(this.cardholderName, { required: true });
    }

    @computed get validDocumentNumber() {
        return validator(this.documentNumber, { required: true });
    }

    @computed get validDocumentType() {
        return validator(this.documentType, { required: true });
    }

    @computed get validExpirationMonth() {
        return validator(this.expirationMonth, { required: true });
    }

    @computed get validExpirationYear() {
        return validator(this.expirationYear, { required: true });
    }

    @computed get expirationDate() {
        return this.expirationMonth + this.expirationYear;
    }

    @action resetCreditCardInfo = () => {
        this.setCreditCardNumber('');
        this.setSecurityCode('');
        this.setExpirationMonth(null);
        this.setExpirationYear(null);
        this.setCardholderName('');
    }

    @action setCreditCardNumber = (creditCardNumber) => {
        this.creditCardNumber = creditCardNumber;
    }

    @action setSecurityCode = (securityCode) => {
        this.securityCode = securityCode;
    }

    @action setExpirationMonth = (expirationMonth) => {
        this.expirationMonth = expirationMonth;
    }

    @action setExpirationYear = (expirationYear) => {
        if (Number(expirationYear) === (moment().year() - 2000)) this.expirationMonth = null;
        this.expirationYear = expirationYear;
    }

    @action setCardholderName = (cardholderName) => {
        this.cardholderName = cardholderName;
    }

    @action setDocumentType = (documentType) => {
        this.documentType = documentType;
    }

    @action setDocumentNumber = (documentNumber) => {
        this.documentNumber = documentNumber;
    }
}

export default new CheckoutFormStore();
