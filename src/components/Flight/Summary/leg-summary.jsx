import React from 'react';

const stopsGraphic = (stops) => {
    return (
        <div className="stops">
            <div className={`stops__line${!stops ? '--green' : ''}`}></div>
            <div className="stops__circles">
            {Array(stops).fill().map( (_, i) => <div className="stops__circle" key={i}></div>)}
            </div>
        </div>
    )
}

const legHead = (airport, time, plusDays) => {
    return (
        <div className="leg-summary__head">
            <span className="leg-summary__head--airport">{airport}</span>
            <span className="leg-summary__head--time">{time}</span>
            {plusDays ? 
                <span className="leg-summary__head--plus-days">{`+${plusDays}`}</span> : null}
        </div>
    )
}

const LegSummary = ({ from, to, departureTime, arrivalTime, plusDays, stops, luggage=[], flat, airline, duration }) => {
    return (
        <div className="leg-summary">
            {
                flat ?
                <div className="segment__airline">
                    <img className="segment__airline--logo" src={`https://statics.basset.la/airlines/${airline.code}-ISO.svg`} alt={airline.code}/>
                    <span className="segment__airline--name">{airline.name}</span>
                </div>
                : null
            }
            <div className="leg-summary__heads">
                {legHead(from, departureTime)}
                {stopsGraphic(stops)}
                {legHead(to, arrivalTime, plusDays)}
            </div>
            {
                flat ?
                <div className="segment__duration"><span>{duration}</span></div>
                : null
            }
            <div className="leg-summary__luggage">
                
                {luggage.map(l => 
                    <div>
                        {l.carryon?
                            <img alt="Equipaje de mano" className="leg-summary__luggage-icon" src={require('assets/img/flights/hand-luggage.svg')} />
                        :null}
                        {
                            l.quantity&&l.weight?Array(l.quantity).fill().map((_, i) => 
                                <img alt={`Pieza de ${l.weight} kilos`} key={`${l.weight}-${i}`} className="leg-summary__luggage-icon" src={require(`assets/img/flights/luggage.svg`)} />
                            ):null
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default LegSummary;