import { action, observable, computed } from 'mobx';
import { persist } from 'mobx-persist';
import { validator } from './validators';
import moment from 'moment';

class DocTypeObj {
    @persist @observable type;
    @persist @observable number;
    constructor(type,number){
        this.type=type;
        this.number=number;
    }

}
class Guest {
    @persist @observable firstName;
    @persist @observable lastName;
    @persist('object', DocTypeObj) @observable document;
    constructor(firstName,lastName,docType,docNumber){
        this.firstName=firstName;
        this.lastName = lastName;
        this.document = new DocTypeObj(docType,docNumber);
    }
}

class Pax {
    @persist @observable firstName;
    @persist @observable lastName;
    @persist @observable nationality;
    @persist @observable birth;
    @persist @observable gender;
    @persist @observable type;
    @persist('object', DocTypeObj) @observable document;
    constructor(firstName,lastName,docType,docNumber,nationality,birth,gender,type){
        this.firstName=firstName;
        this.lastName = lastName;
        this.nationality = nationality;
        this.birth = birth;
        this.gender = gender;
        this.type = type;
        this.document = new DocTypeObj(docType,docNumber);
    }
}


class GuestsStore {
    @persist('list') @observable guestsArray = [];
    @observable paxArray = [];

    @action validGuest = (guest) =>{
        return this.validName(guest.firstName).valid && this.validLastName(guest.lastName).valid 
        && this.validDocType(guest.document.type).valid && this.validDocNumber(guest.document.number).valid  ;
        //return this.validName(guest.name).valid; 
    }

    @action validPax = (pax) =>{
        return this.validName(pax.firstName).valid && this.validLastName(pax.lastName).valid 
        && this.validDocType(pax.document.type).valid && this.validDocNumber(pax.document.number).valid 
        && this.validNationality(pax.nationality).valid && this.validBirthdate(pax.birth).valid 
        && this.validGender(pax.gender).valid;
        //return this.validName(guest.name).valid; 
    }

    @computed get validFields(){
        if(this.guestsArray.length>0){
            return this.guestsArray.every(this.validGuest);
        }
        if(this.paxArray.length>0){
            return this.paxArray.every(this.validPax);
        }
    }

    @action setGuestArray = (guestArr,valid) =>{
        this.guestsArray = this.guestsArray.length>0 && !valid ?this.guestsArray : guestArr.map(g => new Guest(g.firstName,g.lastName,g.document.type,g.document.number))
    }

    @action setPaxArray = (paxArr,valid) =>{
        this.paxArray = this.paxArray.length>0 && !valid ?this.paxArray : paxArr.map(p => new Pax(p.firstName,p.lastName,p.document?p.document.type:null,p.document?p.document.number:null,p.nationality,p.birth,p.gender,p.type))
    }

    @action validName = (name) =>{
        return validator(name, { required: true })
    }
    
    @action validLastName = (lastName) =>{
        return validator(lastName, { required: true })
    }

    @action validDocType = (docType) =>{
        return validator(docType, { required: true })
    }

    @action validDocNumber = (docNumber) =>{
        return validator(docNumber, { required: true, type:'number' })
    }

    @action validNationality = (nationality) =>{
        return validator(nationality, { required: true })
    }

    @action validBirthdate = (date) =>{
        return validator(date, { required: true })
    }
    
    @action validGender = (gender) =>{
        return validator(gender, { required: true })
    }
    

}

export default new GuestsStore();
