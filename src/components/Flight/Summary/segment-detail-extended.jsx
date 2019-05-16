import React from 'react';
import LegSummary from './leg-summary';
import moment from 'moment-timezone';
moment.tz.setDefault("GMT");

const durationToString = (duration) => {
    const parts = duration.split(':');
    return `${parts[0]}h ${parts[1]}m`;
}

const  renderLugagge = (luggage) =>{
    if(luggage && luggage.length >0){
        return luggage.map((l,k) =>
            <div className="flight-lugagge" key={k}>
                <img alt={`Pieza de ${l.weight} kilos`} key={`${l.weight}`} className="leg-summary__luggage-icon" src={require(`assets/img/flights/luggage.svg`)} />
                <span>{l.quantity} equipaje/s de {l.weight} kg para despachar</span>
            </div>
        )
    }else{
        return (
            <div className="flight-lugagge">
                <img alt="No incluye equipaje para despachar" className="leg-summary__luggage-icon" src={require(`assets/img/flights/no-luggage.svg`)} />
                <span>No incluye equipaje para despachar</span>
            </div>
        )
    }
}

const SegmentDetailExtended = ({legs, luggage,from,to, departureDate, arrivalDate}) => {
    const stops = legs.length - 1;
    return (
        <div className="segment__detail-extended">
           <span className="departure"> Sale: {departureDate} </span>
           {legs.map( (leg ,key)  => {  
                    let arrival_date = moment(leg.arrival_date+' '+leg.arrival_time).format();
                    let stop_departure_date = legs[key+1]?moment(legs[key+1].departure_date+' '+legs[key+1].departure_time).format():null;
                    let diff = (moment(stop_departure_date).diff(moment(arrival_date), 'minutes'));
                    const formatted = moment.utc((diff*60)*1000).format('H[h] mm[m]');
                    return( 
                    <div  key={`${key}-${diff}`}>
                        <div className="leg">
                                <div className="leg-col">
                                    <div className="airline-time">
                                        <img src={`https://statics.basset.la/airlines/${leg.marketing_carrier.code}-ISO.svg`} alt={leg.marketing_carrier.code}/>
                                        <span className="time"><strong>{leg.departure_time}-{leg.arrival_time}</strong></span>
                                    </div>
                                    <div className="cities">
                                        <div className="origin_city"><span className="code">{leg.origin.code}</span>{leg.origin.name}</div>
                                        <div className="destination_city"><span className="code">{leg.destination.code}</span>{leg.destination.name}</div>
                                    </div>
                                    <div className="aircraft">{leg.marketing_carrier.name} {leg.flight_number} - {leg.aircraft_type}</div>
                                </div>
                                <div className="leg-col">
                                    <div className="duration"><span>Duración: {durationToString(leg.duration)}</span></div>
                                    <div className="cabinname">Clase:{leg.cabin_type.name}</div>
                                    <div className="luggage">

                                    <img alt="Equipaje de mano" className="leg-summary__luggage-icon" src={require('assets/img/flights/hand-luggage.svg')} />1 (un) equipaje de mano
                                    {/*luggage.map(l => {
                                        return Array(l.quantity).fill().map((_, i) => 
                                            <img alt={`Pieza de ${l.weight} kilos`} key={`${l.weight}-${i}`} className="leg-summary__luggage-icon" src={require(`assets/img/flights/luggage.svg`)} />
                                        )
                                    })*/}
                                    {renderLugagge(luggage)}
                                    </div>

                                </div>
                            </div>
                            {leg.destination.code!==to?
                                <div className="leg stop">
                                    <div className="leg-title">
                                        <span>Escala:</span> {leg.destination.name}
                                    </div>
                                    <div className="stop-time">
                                    {formatted}
                                    </div>
                                    {legs[key+1].aircraft_type !== leg.aircraft_type? 
                                    <div className="aircraft-change">
                                        Cambio de avión
                                    </div>
                                    :null}
                                </div>
                            :null}
                    </div>
                    )
                }
                )
            }
            <span className="departure"> Llegada: {arrivalDate} </span>
        </div>
    )
}

export default SegmentDetailExtended;