import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import { animateScroll } from 'react-scroll'
import Input, { DropdownInput, TextInput } from '../../Checkout/Form/input';


@inject('contactStore') @observer
export default class GuestForm extends Component {
    render(){
        const phoneTypes = [
            {label:'Celular',value:'M'},
            {label:'Casa',value:'F'},
        ]
        const { contactStore } = this.props;
        return(
            <div className="module">
                <div className="module__top-headline">Habitacion 1</div>
                <div className="module__top-advertise">Será registrado como titular de la reserva de esta habitación.</div>
                <div className="module__payment-info">
                    <div className="module__form-group">
                        <Input title="Email">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={contactStore.validEmail}
                                    value={contactStore.email} action={contactStore.setEmail}
                                    size='large' placeholder='Ingresa tu Email' />
                        </Input>
                        <Input title="Email">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={contactStore.validEmail}
                                    value={contactStore.email} action={contactStore.setEmail}
                                    size='large' placeholder='Ingresa tu Email' />
                        </Input>
                        <Input title="Email">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={contactStore.validEmail}
                                    value={contactStore.email} action={contactStore.setEmail}
                                    size='large' placeholder='Ingresa tu Email' />
                        </Input>
                        <Input title="Email">
                            <TextInput 
                                    forceValidation={this.props.sendAttempted}
                                    valid={contactStore.validEmail}
                                    value={contactStore.email} action={contactStore.setEmail}
                                    size='large' placeholder='Ingresa tu Email' />
                        </Input>
                    </div>
                </div>
            </div>
        )
    }
}