import React from 'react';
import { inject, observer } from "mobx-react";
import Input, { TextInput, DropdownInput } from './input';
import moment from 'moment';
import Cards from 'react-credit-cards';

@inject('checkoutForm', 'billing') @observer
class CreditCardModule extends React.Component {
    state={
        selected:'name'
    }
    render() {
        const { checkoutForm, billing } = this.props;
        let rawMonths = moment.monthsShort()
        const year = moment().year();
        const month = moment().month();
        if (Number(checkoutForm.expirationYear) === (year - 2000)) {
            rawMonths = moment.monthsShort().filter((_, i) => i >= month);
        }
        const months = rawMonths.map((month, i) => ({ label: month, value: i+1 < 10 ? `0${i+1}` : `${i+1}` }));;
        const years = Array.from({length:15}, (_,i) => ({ label: (year + i).toString(), value: (year + i - 2000).toString() }) );
        return (
            <div className="module__payment-info">
                <div className="module__form-group">
                    <div className="col">
                        <Input title="Número de tarjeta" valid={checkoutForm.validCreditCardNumber}>
                            <TextInput
                                onClick={()=>{this.setState({selected:'name'})}}
                                forceValidation={this.props.sendAttempted}
                                valid={checkoutForm.validCreditCardNumber}
                                value={checkoutForm.creditCardNumber} action={checkoutForm.setCreditCardNumber}
                                size='large' placeholder='Sin espacios ni guiones'
                                type='number' />
                        </Input>
                        <Input title="Fecha de expiración">
                            <DropdownInput 
                                options={months}
                                forceValidation={this.props.sendAttempted}
                                valid={checkoutForm.validExpirationMonth}
                                value={checkoutForm.expirationMonth} action={checkoutForm.setExpirationMonth}
                                size='small' placeholder='Mes' />
                            <DropdownInput 
                                options={years}
                                forceValidation={this.props.sendAttempted}
                                valid={checkoutForm.validExpirationYear}
                                value={checkoutForm.expirationYear} action={checkoutForm.setExpirationYear}
                                size='small' placeholder='Año' />
                        </Input>
                        <Input title="Código de seguridad">
                            <TextInput 
                                onFocus={(x)=>{console.log('a ver');this.setState({selected:'cvc'})}}

                                forceValidation={this.props.sendAttempted}
                                valid={checkoutForm.validSecurityCode}
                                value={checkoutForm.securityCode} action={checkoutForm.setSecurityCode}
                                size='medium' placeholder='xxx' type='number'/>
                        </Input>
                        <Input title="Nombre y apellido del titular">
                            <TextInput 
                            
                                forceValidation={this.props.sendAttempted}
                                valid={checkoutForm.validCardholderName}
                                value={checkoutForm.cardholderName} action={checkoutForm.setCardholderName}
                                size='large' placeholder='Como figura en la tarjeta' />
                        </Input>
                        <Input title="Tipo y Nº de Documento">
                            <DropdownInput
                                forceValidation={this.props.sendAttempted} 
                                valid={checkoutForm.validDocumentType}
                                defaultValue={billing.documentTypes[0]}
                                options={billing.documentTypes}
                                value={checkoutForm.documentType} action={checkoutForm.setDocumentType}
                                size='small' placeholder='Tipo' />
                            <TextInput
                                forceValidation={this.props.sendAttempted}
                                valid={checkoutForm.validDocumentNumber}
                                type='number'
                                value={checkoutForm.documentNumber} action={checkoutForm.setDocumentNumber}
                                size='medium' placeholder='Introduce el número' />
                        </Input>
                    </div>
                    <div className="col">
                        
                    </div>
                        
                </div>
            </div>
        )
    }
}

export default CreditCardModule;