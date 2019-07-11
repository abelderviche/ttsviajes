import { action, observable, computed } from 'mobx';

import ApiClient from './api-client';
import CheckoutFormStore from './checkout-form';
import { validator } from './validators';
import ENV from 'config';

class BillingStore {
    @observable fiscalSituations = [ {label: 'Consumidor Final', value: 'CF'}, {label: 'Responsable Inscripto', value: 'RI'} ];
    @observable documentTypes = [ {label: 'DNI', value: 'DNI'} ]; 
    @observable states = [];
    @observable cities = [];
    @observable fiscalIdTypes = [{ value: 'CUIL', label: 'CUIL' }, { value: 'CUIT', label: 'CUIT' }];

    @observable state;
    @observable city;

    @observable fiscalName;
    @observable cuitType = 'CF';
    @observable cuit;
    @observable fiscalIdType = 'CUIL';
    @observable street;
    @observable number;
    @observable floor;
    @observable apt;
    @observable zipCode;

    @computed get validFields() {
        return this.validFiscalName.valid && this.validCuit.valid && this.validStreet.valid 
            && this.validNumber.valid && this.validZipCode.valid && this.validCuitType.valid
            && this.validState.valid && this.validCity.valid;
    }

    @computed get validState() {
        return validator(this.state, { required: true });
    }

    @computed get validCity() {
        return validator(this.city, { required: true });
    }

    @computed get validCuit() {
        return validator(this.cuit, { required: true, cuit: true });
    }

    @computed get validStreet() {
        return validator(this.street, { required: true });
    }

    @computed get validNumber() {
        return validator(this.number, { required: true, type: 'number' });
    }

    @computed get validZipCode() {
        return validator(this.zipCode, { required: true });
    }

    @computed get validCuitType() {
        return validator(this.cuitType, { required: true });
    }

    @computed get validFiscalIdType() {
        return validator(this.fiscalIdType, { required: true });
    }

    @computed get validFiscalName() {
        return validator(this.fiscalName, { required: true });
    }

    @action retrieveData = () => {
        this.retrieveStates();
        this.retrieveFiscalSituations();
        this.retrieveDocumentTypes();
    }

    @action retrieveFiscalSituations = () => {
        ApiClient.get(ENV.CHECKOUT.FISCAL_SITUATIONS).then(
            res => {
                if (res.data) {
                    this.fiscalSituations = res.data.data.map(d => ({ value: d.code, label: d.texto }));
                    this.setCuitType(this.fiscalSituations[0].value);
                }
            }
        )
    }

    @action retrieveDocumentTypes = () => {
        ApiClient.get(ENV.CHECKOUT.DOCUMENT_TYPES).then(
            res => {
                if (res.data) {
                    this.documentTypes = res.data.data.map(d => ({ value: d.code, label: d.texto }));
                    CheckoutFormStore.setDocumentType(this.documentTypes[0].value);
                }
            }
        )
    }
    
    @action retrieveStates = () => {
        return new Promise((resolve, reject) => {
            ApiClient.get(ENV.CHECKOUT.STATES).then(
                res => {
                    if (res.data) {
                        const { data } = res.data;
                        this.states = data.map(s => ({ value: s.codigo, label: s.nombre }));
                        resolve(this.states);
                    }
                },
                err => reject(err)
            )
        });
    }

    @action retrieveCities = () => {
        return new Promise((resolve, reject) => {
            if (this.state) {
                ApiClient.get(ENV.CHECKOUT.CITIES.replace('{id}', this.state)).then(
                    res => {
                        if (res.data) {
                            const { data } = res.data;
                            this.cities = data.map(c => ({ value: c.codigo, label: c.nombre }));
                            resolve(this.cities);
                        }
                    },
                    err => reject(err)
                )
            } else {
                reject("No state selected");
            }
        });
    }

    @action setState = (value) => {
        this.city = undefined;
        this.state = value;
        this.retrieveCities();
    }

    @action setCity = (value) => {
        this.city = value;
    }

    @action setCuitType = (value) => {
        this.cuitType = value;
        this.setFiscalIdType(value==='CF'?'CUIL':'CUIT');
    }

    @action setFiscalIdType = (value) => {
        this.fiscalIdType = value;
    }

    @action setCuit = (value) => {
        this.cuit = value;
    }

    @action setStreet = (value) => {
        this.street = value;
    }

    @action setNumber = (value) => {
        this.number = value;
    }

    @action setFloor = (value) => {
        this.floor = value;
    }

    @action setApt = (value) => {
        this.apt = value;
    }

    @action setZipCode = (value) => {
        this.zipCode = value;
    }

    @action setFiscalName = (value) => {
        this.fiscalName = value;
    }
}

export default new BillingStore();
