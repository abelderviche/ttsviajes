import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import { animateScroll } from 'react-scroll'
import Input, { DropdownInput, TextInput } from './input';


@inject('contactStore') @observer
export default class ContactFormModule extends Component {
    render(){
        const phoneTypes = [
            {label:'Celular',value:'M'},
            {label:'Casa',value:'F'},
        ]
        const { contactStore } = this.props;
        return(
            <div className="module">
                <div className="module__top-headline">Informacion de contacto</div>
                {!contactStore.validFields?<div>completa los campos</div>:null}
                <div className="module__payment-info">
                    <div className="module__form-group">
                        <Input title="Email">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={contactStore.validEmail}
                                    value={contactStore.email} action={contactStore.setEmail}
                                    size='large' placeholder='Ingresa tu Email' />
                        </Input>
                        <Input title="Confirma Tu email">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={contactStore.validConfirmEmail}
                                    value={contactStore.confirmEmail} action={contactStore.setConfirmEmail}
                                    size='large' placeholder='Vuelve a ingresar tu Email' />
                        </Input>
                        <Input title="Telefono">
                            <DropdownInput 
                                defaultValue={contactStore.phoneType}
                                forceValidation={this.props.sendAttempted}
                                options={phoneTypes}
                                valid={contactStore.validPhoneType}
                                value={contactStore.phoneType} action={contactStore.setPhoneType}
                                size='medium-sm' placeholder='Seleccioná tipo' />
                        </Input>
                        <Input title="Cod. de pais">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={contactStore.validCountryCode}
                                    value={contactStore.countryCode} action={contactStore.setCountryCode}
                                    size='large' placeholder='54' />
                        </Input>
                        <Input title="Cod. de area">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={contactStore.validAreaCode}
                                    value={contactStore.areaCode} action={contactStore.setAreaCode}
                                    size='large' placeholder='011' />
                        </Input>
                        <Input title="Numero">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={contactStore.validPhoneNumber}
                                    value={contactStore.phoneNumber} action={contactStore.setPhoneNumber}
                                    size='large' placeholder='Ingresa tu numero' />
                        </Input>
                    </div>
                </div>
            </div>
        )
    }
}