import { action, observable, computed } from 'mobx';
import { validator } from './validators';
import PaymentMethod from './payment-method';
import moment from 'moment';

class GuestsStore {
    @observable guestsArray = [];

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
    
}

export default new GuestsStore();
