import React from 'react';
import Loader from 'components/Global/loader';
import ENV from 'config';


const Button = ({ action, loading ,price,availablePayment,availableAssistCard,selectedAssistcard, checkContact}) => {
    //const text = availablePayment?'Pagar':'Finalizar'; 
    const text = checkContact?'Finalizar':!availableAssistCard?`Pagar - ${price}`: selectedAssistcard?`Pagar con cobertura - ${price}`:`Pagar sin cobertura - ${price}`;
    return (
        <div className={`next-button noselect ${loading ? 'next-button--loading' : ''} ${ENV.SUBCHANNEL!=='tts'?`next-button--${ENV.SUBCHANNEL}`:''}`} 
            onClick={() => {
                if (!loading) action()
            }} >
            {
                loading ? 
                <Loader type="pulse-center" propColor='white'/>
                :
                <span>{text}</span>
            }
        </div>
    );
}

export default Button;