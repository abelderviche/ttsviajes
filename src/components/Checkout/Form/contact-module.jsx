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
            <div className="module contact-form">
                <div className="module__top-headline">Información de contacto</div>
                {/*!contactStore.validFields?<div>completa los campos</div>:null*/}
                <div className="contact-form-info">
                    <div className="module__form-group">
                        <div className="contact-form-section">
                            <div className="contact-form-section-title">
                                ¿A dónde enviamos tus vouchers?
                            </div>
                            <div className="contact-form-section-form">
                                <Input title="Email">
                                    <TextInput 
                                            forceValidation={this.props.sendAttempted}
                                            valid={contactStore.validEmail}
                                            value={contactStore.email} action={contactStore.setEmail}
                                            size='medium' placeholder='Ingresa tu Email' />
                                </Input>
                                <Input title="Confirma Tu email">
                                    <TextInput 
                                            forceValidation={this.props.sendAttempted}
                                            valid={contactStore.validConfirmEmail}
                                            value={contactStore.confirmEmail} action={contactStore.setConfirmEmail}
                                            size='medium' placeholder='Vuelve a ingresar tu Email' />
                                </Input>
                            </div>
                        </div>
                        <div className="contact-form-section">
                            <div className="contact-form-section-title">
                                ¿A qué teléfono podemos comunicarnos?
                            </div>
                            <div className="contact-form-section-form">
                                <Input title="Teléfono">
                                    <DropdownInput 
                                        defaultValue={contactStore.phoneType}
                                        forceValidation={this.props.sendAttempted}
                                        options={phoneTypes}
                                        valid={contactStore.validPhoneType}
                                        value={contactStore.phoneType} action={contactStore.setPhoneType}
                                        size='small' placeholder='Tipo' />
                                </Input>
                                <Input title="Cod. de pais">
                                    <TextInput 
                                            forceValidation={this.props.sendAttempted}
                                            valid={contactStore.validCountryCode}
                                            value={contactStore.countryCode} action={contactStore.setCountryCode}
                                            size='small' placeholder='54' />
                                </Input>
                                <Input title="Cod. de area">
                                    <TextInput 
                                            forceValidation={this.props.sendAttempted}
                                            valid={contactStore.validAreaCode}
                                            value={contactStore.areaCode} action={contactStore.setAreaCode}
                                            size='small' placeholder='011' />
                                </Input>
                                <Input title="Numero">
                                    <TextInput 
                                            forceValidation={this.props.sendAttempted}
                                            valid={contactStore.validPhoneNumber}
                                            value={contactStore.phoneNumber} action={contactStore.setPhoneNumber}
                                            size='medium-sm' placeholder='Ingresá tu numero' />
                                </Input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}