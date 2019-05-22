import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import { animateScroll } from 'react-scroll'
import Input, { DropdownInput, TextInput } from '../../Checkout/Form/input';
import { validator } from '../../../stores/validators';
@inject('guestsStore') @observer

class GuestForm extends Component {
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
        return(
            <div className="module">
                <div className="module__top-headline">Habitacion {this.props.guest.id}</div>
                <div className="module__top-advertise">Será registrado como titular de la reserva de esta habitación.</div>
                <div className="module__payment-info">
                    <div className="module__form-group">
                        <Input title="Nombre">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={validator(this.props.guest.name, { required: true })}
                                    value={this.props.guest.name} action={this.setName}
                                    size='medium-sm' placeholder='Como figura en el documento' />
                        </Input>
                        <Input title="Apellido">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={validator(this.props.guest.lastname, { required: true })}
                                    value={this.props.guest.lastname} action={this.setLastname}
                                    size='medium-sm' placeholder='Como figura en el documento' />
                        </Input>
                        <Input title="Tipo de documento">
                            <DropdownInput 
                                forceValidation={this.props.sendAttempted}
                                options={docTypes}
                                valid={validator(this.props.guest.docType, { required: true })}
                                value={this.props.guest.docType} action={this.setDocType}
                                size='medium-sm' placeholder='Tipo' />
                        </Input>
                        <Input title="Número">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={validator(this.props.guest.numDoc, { required: true, type:'number' })}
                                    value={this.props.guest.numDoc} action={this.setNumDoc}
                                    size='medium-sm' placeholder='Ingresá el número' />
                        </Input>
                    </div>
                </div>
            </div>
        )
    }
}

export default GuestForm;