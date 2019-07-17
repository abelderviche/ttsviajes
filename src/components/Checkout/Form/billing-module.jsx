import React from 'react';
import Input, { DropdownInput, TextInput } from './input';
import { inject, observer } from "mobx-react"; 

@inject('billing') @observer
class BillingModule extends React.Component {
    render() {
        const { billing } = this.props;
        return (
            <div className="module">
                <div className="module__top-headline">¿A nombre de quién emitimos la factura?</div>
                <div className="module__top-advertise">
                    <svg className="module__top-advertise__icon">
                        <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-info`}></use>
                    </svg>Por disposición de la AFIP, la factura tiene que ser emitida a nombre de la persona que realiza el pago.
                </div>
                <div className="module__payment-info">
                    <div className="module__form-group">
                        <Input title="Nombre / Razón social">
                            <TextInput 
                                forceValidation={this.props.sendAttempted}
                                valid={billing.validFiscalName} 
                                value={billing.fiscalName} action={billing.setFiscalName}
                                size='large' placeholder='Ingresa el nombre / razón social' />
                        </Input>
                        <Input title="Situación fiscal">
                            <DropdownInput 
                                forceValidation={this.props.sendAttempted}
                                defaultValue={billing.fiscalSituations[0]}
                                options={billing.fiscalSituations}
                                valid={billing.validCuitType}
                                value={billing.cuitType} action={billing.setCuitType}
                                size='medium-sm' placeholder='Consumidor final' />
                        </Input>
                        <Input title="CUIT/CUIL">
                            <TextInput 
                                forceValidation={this.props.sendAttempted}
                                valid={billing.validCuit} type='number'
                                value={billing.cuit} action={billing.setCuit}
                                size='medium-sm' placeholder='Ingresa el número' />
                        </Input>
                        <Input title="Provincia">
                            <DropdownInput 
                                options={billing.states}
                                forceValidation={this.props.sendAttempted}
                                valid={billing.validState}
                                action={billing.setState} value={billing.state}
                                size='medium' placeholder='Selecciona' />
                        </Input>
                        <Input title="Ciudad">
                            <DropdownInput 
                                options={billing.cities}
                                forceValidation={this.props.sendAttempted}
                                valid={billing.validCity}
                                action={billing.setCity} value={billing.city}
                                size='medium' placeholder='Selecciona' />
                        </Input>
                        <Input title="Calle">
                            <TextInput 
                                forceValidation={this.props.sendAttempted}
                                valid={billing.validStreet}
                                value={billing.street} action={billing.setStreet}
                                size='large'/>
                        </Input>
                        <Input title="Número">
                            <TextInput size='small' 
                                forceValidation={this.props.sendAttempted}
                                valid={billing.validNumber}
                                value={billing.number} action={billing.setNumber}/>
                        </Input>
                        <Input title="Piso">
                            <TextInput size='xsmall' type='number'
                                forceValidation={this.props.sendAttempted}
                                valid={billing.validFloor}
                                value={billing.floor} action={billing.setFloor} />
                        </Input>
                        <Input title="Dpto.">
                            <TextInput size='xsmall'
                                forceValidation={this.props.sendAttempted}
                                valid={billing.validApt}
                                value={billing.apt} action={billing.setApt} />
                        </Input>
                        <Input title="Cod. Postal">
                            <TextInput size='medium'
                                forceValidation={this.props.sendAttempted}
                                valid={billing.validZipCode}
                                value={billing.zipCode} action={billing.setZipCode} />
                        </Input>
                    </div>
                </div>
            </div>
        );
    }
}

export default BillingModule;