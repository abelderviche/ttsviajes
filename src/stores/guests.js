import { action, observable, computed } from 'mobx';
import { validator } from './validators';
import PaymentMethod from './payment-method';
import moment from 'moment';

class GuestsStore {
    @observable guestsArray = [];
    @observable paxArray = [];

    @action generateGuestArray = (rooms) =>{
        for (var i = 1; i <= rooms; i++) {
            let obj = {
                id: i,
                name:'',
                lastname:'',
                docType:'',
                numDoc:''
            }
            this.guestsArray.push(obj);
        } 
    }
    @action generatePaxArray = (rooms) =>{
        for (var i = 1; i <= rooms; i++) {
            let obj = {
                type: "ADT",
                firstName: "",
                lastame: "",
                gender: "",
                birth: "",
                document: {
                    type: "",
                    number: ""
                },
                nationality: ""
            }
            this.paxArray.push(obj);
        } 
    }

    @action setPaxArray = (paxArr) =>{
        this.paxArray = paxArr;
    }
    
}

export default new GuestsStore();
