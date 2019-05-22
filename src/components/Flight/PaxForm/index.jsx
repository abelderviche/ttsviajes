import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import { animateScroll } from 'react-scroll'
import Input, { DropdownInput, TextInput } from '../../Checkout/Form/input';
import { validator } from '../../../stores/validators';
@inject('guestsStore') @observer

class PaxForm extends Component {
    // state ={
    //     name:'',
    //     lastname:'',
    //     docType:'',
    //     numDoc:''
    // }
    constructor(props){
        super(props);
     //   this.state = this.props.guest;
    }
    setName = (value)=>{
        this.props.guest.name=value;
    }
    setLastname = (value)=>{
        this.props.guest.lastname=value;
    }
    setDocType = (value)=>{
        this.props.guest.docType=value;
    }
    setNumDoc = (value)=>{
        this.props.guest.numDoc=value;
    }

    render(){
        const docTypes = [
            {label:'DNI',value:'DNI'},
            {label:'Pasaporte',value:'PASSPORT'},
        ]
        const sexType = [
            {label:'Masculino',value:'M'},
            {label:'Femenino',value:'F'},
        ]
        const days = [1,2,3,4,5,6,7,8,9,10].map((d)=>({label:d,value:d}));
        const months = [
            {label:'Enero',value:1},
            {label:'Febrero',value:2},
            {label:'Marzo',value:3},
            {label:'Abril',value:4},
            {label:'Mayo',value:5},
            {label:'Junio',value:6},
            {label:'Julio',value:7},
            {label:'Agosto',value:8},
            {label:'Septiembr',value:9},
            {label:'Octubre',value:10},
            {label:'Noviembre',value:11},
            {label:'Diciembre',value:12},
        ];
        const years = [1991,1992,1993,1994,1995,1996,1997,1998,1999,2000].map((d)=>({label:d,value:d}));
        const countries = [
            {label:'Argentina',value:'AR'},
            {label:'Chile',value:'CH'},
        ]
        return(
            <div className="module">
                <div className="module__top-headline">Habitacion {this.props.guest.id}</div>
                <div className="module__top-advertise">Será registrado como titular de la reserva de esta habitación.</div>
                <div className="module__payment-info">
                    <div className="module__form-group">
                        <Input title="Nombre/s">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={validator(this.props.guest.name, { required: true })}
                                    value={this.props.guest.name} action={this.setName}
                                    size='medium-sm' placeholder='Como figura en el documento' />
                        </Input>
                        <Input title="Apellido/s">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={validator(this.props.guest.lastname, { required: true })}
                                    value={this.props.guest.lastname} action={this.setLastname}
                                    size='medium-sm' placeholder='Como figura en el documento' />
                        </Input>
                        <Input title="Tipo y número de documento">
                            <DropdownInput 
                                forceValidation={this.props.sendAttempted}
                                options={docTypes}
                                valid={validator(this.props.guest.docType, { required: true })}
                                value={this.props.guest.docType} action={this.setDocType}
                                size='small' placeholder='Tipo' />
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={validator(this.props.guest.numDoc, { required: true, type:'number' })}
                                    value={this.props.guest.numDoc} action={this.setNumDoc}
                                    size='medium-sm' placeholder='Ingresá el número' />
                        </Input>
                        <Input title="Nacionalidad">
                            <DropdownInput 
                                forceValidation={this.props.sendAttempted}
                                options={countries}
                                valid={validator(this.props.guest.docType, { required: true })}
                                value={this.props.guest.docType} action={this.setDocType}
                                size='medium-sm' placeholder='Sexo' />
                        </Input>
                        <Input title="Fecha de nacimiento">
                            <DropdownInput 
                                forceValidation={this.props.sendAttempted}
                                options={days}
                                valid={validator(this.props.guest.docType, { required: true })}
                                value={this.props.guest.docType} action={this.setDocType}
                                size='small' placeholder='Dia' />
                            <DropdownInput 
                                forceValidation={this.props.sendAttempted}
                                options={months}
                                valid={validator(this.props.guest.docType, { required: true })}
                                value={this.props.guest.docType} action={this.setDocType}
                                size='medium-sm' placeholder='Mes' />
                            <DropdownInput 
                                forceValidation={this.props.sendAttempted}
                                options={years}
                                valid={validator(this.props.guest.docType, { required: true })}
                                value={this.props.guest.docType} action={this.setDocType}
                                size='small' placeholder='Año' />
                        </Input>
                        <Input title="Sexo">
                            <DropdownInput 
                                forceValidation={this.props.sendAttempted}
                                options={sexType}
                                valid={validator(this.props.guest.docType, { required: true })}
                                value={this.props.guest.docType} action={this.setDocType}
                                size='medium-sm' placeholder='Sexo' />
                        </Input>
                    </div>
                </div>
            </div>
        )
    }
}

export default PaxForm;