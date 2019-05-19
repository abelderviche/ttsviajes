import { action, observable, computed } from 'mobx';
import { validator } from './validators';
import PaymentMethod from './payment-method';
import moment from 'moment';

class ContactFormStore {
    @observable email = '';
    @observable confirmEmail = '';
    @observable phoneType = 'M';
    @observable countryCode = '54';
    @observable areaCode = '011';
    @observable phoneNumber = '';

    @computed get validFields() {
        return this.validEmail.valid &&  this.validConfirmEmail.valid && 
        this.validPhoneType.valid && this.validCountryCode.valid && 
        this.validAreaCode.valid && this.validPhoneNumber.valid ;
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

    @computed get validEmail() {
        return validator(this.email, { required: true, type: 'email' });
    }
    @computed get validConfirmEmail() {
        return validator(this.confirmEmail, { required: true, type: 'email' ,email:this.email});
    }

    @computed get validPhoneType() {
        return validator(this.phoneType, { required: true });
    }
    @computed get validCountryCode() {
        return validator(this.countryCode, { required: true, type: 'number'  });
    }
    @computed get validAreaCode() {
        return validator(this.areaCode, { required: true, type: 'number'  });
    }
    @computed get validPhoneNumber() {
        return validator(this.phoneNumber, { required: true, type: 'number'  });
    }

    @action resetCreditCardInfo = () => {
        this.setCreditCardNumber('');
        this.setSecurityCode('');
        this.setExpirationMonth(null);
        this.setExpirationYear(null);
        this.setCardholderName('');
    }

    @action setEmail = (email) => {
        this.email = email;
    }
    @action setConfirmEmail = (confirmEmail) => {
        this.confirmEmail = confirmEmail;
    }

    @action setPhoneType= (phoneType) => {
        this.phoneType = phoneType;
    }

    @action setCountryCode= (countryCode) => {
        this.countryCode = countryCode;
    }
    
    @action setAreaCode= (areaCode) => {
        this.areaCode = areaCode;
    }

    @action setPhoneNumber= (phoneNumber) => {
        this.phoneNumber = phoneNumber;
    }

    
}

export default new ContactFormStore();
