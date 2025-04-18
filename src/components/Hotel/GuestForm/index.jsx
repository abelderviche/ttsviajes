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
    state = {
        collapsed: true
    }

    toggleCollapsed = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }
    setName = (value)=>{
        this.props.guest.firstName=value;
    }
    setLastname = (value)=>{
        this.props.guest.lastName=value;
    }
    setDocType = (value)=>{
        this.props.guest.document.type=value;
    }
    setNumDoc = (value)=>{
        this.props.guest.document.number=value;
    }

    render(){
        const {guestsStore} = this.props;
        const docTypes = [
            {label:'DNI',value:'DNI'},
            {label:'Pasaporte',value:'PASSPORT'},
        ]
        return(
            <div className={`guest-form module ${this.state.collapsed ? 'guest-form--collapsed' : ''}`} >
                <div className="guest-form-headline" onClick={this.toggleCollapsed}>Habitación {this.props.keyData}</div>
                <div className={`guest-form__form-container ${!this.state.collapsed ? 'guest-form__hidden' : ''}`}>
                    <div className="module__top-advertise">Será registrado como titular de la reserva de esta habitación.</div>
                    <div className="module__payment-info">
                        <div className="module__form-group">
                            <Input title="Nombre">
                                <TextInput 
                                        forceValidation={this.props.sendAttempted}
                                        valid={guestsStore.validName(this.props.guest.firstName)}
                                        value={this.props.guest.firstName} action={this.setName}
                                        size='medium-sm' placeholder='Como figura en el documento' />
                            </Input>
                            <Input title="Apellido">
                                <TextInput 
                                        forceValidation={this.props.sendAttempted}
                                        valid={guestsStore.validLastName(this.props.guest.lastName)}
                                        value={this.props.guest.lastName} action={this.setLastname}
                                        size='medium-sm' placeholder='Como figura en el documento' />
                            </Input>
                            <Input title="Tipo de documento">
                                <DropdownInput 
                                    forceValidation={this.props.sendAttempted}
                                    options={docTypes}
                                    valid={guestsStore.validDocType(this.props.guest.document.type)}
                                    value={this.props.guest.document.type} action={this.setDocType}
                                    size='small' placeholder='Tipo' />
                            </Input>
                            <Input title="Número">
                                <TextInput 
                                        forceValidation={this.props.sendAttempted}
                                        valid={guestsStore.validDocNumber(this.props.guest.document.number)}
                                        value={this.props.guest.document.number} action={this.setNumDoc}
                                        size='medium-sm' placeholder='Ingresá el número' />
                            </Input>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default GuestForm;