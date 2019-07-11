import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import moment from 'moment';
import Input, { DropdownInput, TextInput, DropdownDate} from '../../Checkout/Form/input';
import { validator } from '../../../stores/validators';

const _PASSENGERS__LABELS = {
    "ADT": "Adulto",
    "CH": "Niño",
    "INF": "Infante"
}
@inject('guestsStore') @observer

class PaxForm extends Component {
    state ={
        day:'',
        month:'',
        year:'',
    }
    constructor(props){
        super(props);
     //   this.state = this.props.pax;
    
    }
    setName = (value)=>{
        this.props.guestsStore.paxArray[this.props.keyData].firstName = value;
     //   this.props.pax.firstName=value;
    }
    setLastname = (value)=>{
        this.props.guestsStore.paxArray[this.props.keyData].lastName=value;
    }
    setDocType = (value)=>{
        this.props.guestsStore.paxArray[this.props.keyData].document.type=value;
    }
    setNumDoc = (value)=>{
        this.props.guestsStore.paxArray[this.props.keyData].document.number=value;
    }
    setNationality = (value)=>{
        this.props.guestsStore.paxArray[this.props.keyData].nationality=value;
    }
    
    setStateDay = (value) =>{
        this.setState({day:value});
    }
    setStateMonth = (value) =>{
        this.setState({month:value});
    }
    setStateYear = (value) =>{
        this.setState({year:value});
    }

    setGender = (value)=>{
        this.props.guestsStore.paxArray[this.props.keyData].gender=value;
    }

    getDate = () =>{
        if(this.state.year && this.state.month && this.state.day && moment(`${this.state.year}${this.state.month}${this.state.day}`,'YYYYMMDD').isValid()){
            let date = moment(`${this.state.year}${this.state.month}${this.state.day}`,'YYYYMMDD').format('YYYY-MM-DD');
            this.props.guestsStore.paxArray[this.props.keyData].birth = date;
            return date;
        }
        this.props.guestsStore.paxArray[this.props.keyData].birth = '';
        return '';
    }

    render(){
        let {guestsStore} = this.props;
        const docTypes = [
            {label:'DNI',value:'DNI'},
            {label:'Pasaporte',value:'PASSPORT'},
        ]
        const sexType = [
            {label:'Masculino',value:'M'},
            {label:'Femenino',value:'F'},
        ]
        const days = Array.from({length:31}, (_,d)=>({label:d+1,value: d+1 < 10 ? `0${d+1}` : `${d+1}`}));
        const months = moment.months().map((m,k)=>({label:m[0].toUpperCase()+m.slice(1),value: k+1 < 10 ? `0${k+1}` : `${k+1}`}))
        const present_year  = moment().year();
        const paxType = guestsStore.paxArray[this.props.keyData].type;
        let minYear, maxYear;
        if(paxType==='ADT'){
            maxYear = present_year-12;
            minYear = maxYear-97;
        }else if(paxType==='CH'){
            maxYear = present_year-2;
            minYear = maxYear-11;
        }else if(paxType==='INF'){
            maxYear = present_year;
            minYear = maxYear-2;
        }
        const years = Array.apply(null, Array(maxYear-minYear+1)).map(function (_, i) {let ye = maxYear-i; return {label:ye,value:ye};})
        const countries = [
            {label:'Argentina',value:'AR'},
            {label:'Chile',value:'CH'},
        ]
        let passenger = guestsStore.paxArray[this.props.keyData];

        return(
            <div className="guest-form module" id={`pax-no-${this.props.keyData}`}>
                <div className="guest-form-headline">{_PASSENGERS__LABELS[paxType]}</div>
                <div className="module__payment-info">
                    <div className="module__form-group">
                        <Input title="Nombre/s">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={guestsStore.validName(passenger.firstName)}
                                    value={passenger.firstName} action={this.setName}
                                    size='medium-sm' placeholder='Como figura en el documento' />
                        </Input>
                        <Input title="Apellido/s">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={guestsStore.validLastName(passenger.lastName)}
                                    value={passenger.lastName} action={this.setLastname}
                                    size='medium-sm' placeholder='Como figura en el documento' />
                        </Input>
                        <Input title="Tipo y número de documento">
                            <DropdownInput 
                                forceValidation={this.props.sendAttempted}
                                options={docTypes}
                                defaultValue={docTypes.find(s=>s.value===passenger.document.type)}
                                valid={guestsStore.validDocType(passenger.document.type)}
                                value={passenger.document.type} action={this.setDocType}
                                size='small' placeholder='Tipo' />
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={guestsStore.validDocNumber(passenger.document.number)}
                                    value={passenger.document.number} action={this.setNumDoc}
                                    size='medium-sm' placeholder='Ingresá el número' />
                        </Input>

                        <Input title="Nacionalidad">
                            <DropdownInput 
                                forceValidation={this.props.sendAttempted}
                                options={countries}
                                defaultValue={countries.find(s=>s.value===passenger.nationality)}
                                valid={guestsStore.validNationality(passenger.nationality)}
                                value={passenger.nationality} action={this.setNationality}
                                size='medium-sm' placeholder='Nacionalidad' />
                        </Input>

                        <Input title="Fecha de nacimiento">
                            <DropdownDate 
                                forceValidation={this.props.sendAttempted}
                                days={days}
                                months={months}
                                years={years}
                                value=''
                                actionDay={this.setStateDay}
                                actionMonth={this.setStateMonth}
                                actionYear={this.setStateYear}
                                valid={guestsStore.validBirthdate(this.getDate())}
                                />
                        </Input>
                        
                        <Input title="Sexo">
                            <DropdownInput 
                                defaultValue={sexType.find(s=>s.value===passenger.gender)}
                                forceValidation={this.props.sendAttempted}
                                options={sexType}
                                valid={guestsStore.validGender(passenger.gender)}
                                value={passenger.gender} action={this.setGender}
                                size='medium-sm' placeholder='Sexo' />
                        </Input>
                    </div>
                </div>
            </div>
        )
    }
}

export default PaxForm;