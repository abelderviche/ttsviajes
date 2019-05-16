import React from 'react';
import ReactGA from 'react-ga';
import Responsive from 'react-responsive-decorator';
class ThanksContact extends React.Component{
    render(){
        return (
            <div id="thanks-container">
                
                <div className="thanks__title">
                    <img src={require('assets/img/thanks/check-circle.svg')} alt="Ok" />
                    <span>Gracias por confiar en TTS Viajes</span>
                </div>
                
                <div className="segment__detail">
                    <div className="thanks__reservation">
                        <div className="thanks__status">Te estaremos contactando para finalizar la operación</div>
                    </div>
                </div>

            </div>
        )
    }
}
export default Responsive(ThanksContact);