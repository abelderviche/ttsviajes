import React from 'react';
import moment from 'moment-timezone';
import Detail from './detail';
import { inject, observer } from 'mobx-react';
moment.tz.setDefault("GMT");

class HotelTermAndConditions extends React.Component {

    state = {
        collapsed: true
    }

    render() {
        const { collapsed } = this.state;
        const { instructions,cancelPenalties } = this.props;
        //console.log(document.getElementsByClassName('charges')[0]?document.getElementsByClassName('charges')[0].offsetHeight:null);


        return (
            <div className={`hotel noselect ${collapsed ? 'hotel__collapsed' : ''}`}  onClick={() => this.setState({collapsed: !collapsed})}>
                    <div className="hotel__headline"><h2>Instrucciones para el checkin</h2></div>
                <div className="hotel__details">
                    <div  dangerouslySetInnerHTML={{__html:instructions}}></div>
                </div>
                {cancelPenalties?
                    <div>
                        <div className="hotel__headline"><h2>Políticas de cambio y cancelación</h2></div>
                        <div className="hotel__details">
                            Podés realizar cancelar o realizar cambios sin cargo hasta el {cancelPenalties[0].startDate} a las {cancelPenalties[0].startTime}. Tendrás una penalidad de {cancelPenalties[0].nights} noche a partir del {cancelPenalties[0].startDate} a las {cancelPenalties[0].startTime} hasta el {cancelPenalties[0].endDate}  a las {cancelPenalties[0].endTime} . Si no te presentás (No show) se le cobrará el total de la tarifa. Todos los horarios están expresados en hora local.
                        </div>
                    </div>
                :null}
            </div>
        );
    }
}

export default HotelTermAndConditions;