import React from 'react';
import LegSummary from './leg-summary';
import SegmentDetailExtended from './segment-detail-extended';


const durationToString = (duration) => {
    const parts = duration.split(':');
    return `${parts[0]}h ${parts[1]}m`;
}

const SegmentDetail = ({origin, destination, departureTime, arrivalTime, plusDays, legs, luggage, duration, flat,departureDate,arrivalDate,extendedDetail}) => {
    const stops = legs.length - 1;
    const airline = legs[0].marketing_carrier;
    return (
        <div className="segment__detail">
            <div className="segment__info">
                {
                    !flat ? 
                    <div className="segment__info--headline">
                        <div className="segment__airline">
                            <img className="segment__airline--logo" src={`https://statics.basset.la/airlines/${airline.code}-ISO.svg`} alt={airline.code}/>
                            <span className="segment__airline--name">{airline.name}</span>
                        </div>
                        <div className="segment__duration"><span>{durationToString(duration)}</span></div>
                    </div>
                    : null
                }
                <LegSummary 
                    flat={flat}
                    airline={airline}
                    duration={durationToString(duration)}
                    from={origin}
                    to={destination} 
                    departureTime={departureTime}
                    arrivalTime={arrivalTime}
                    stops={stops}
                    plusDays={plusDays}
                    luggage={luggage} />

                    {extendedDetail ?  <SegmentDetailExtended
                    legs={legs}
                    luggage={luggage}
                    from={origin}
                    to={destination} 
                    departureDate={departureDate}
                    arrivalDate={arrivalDate} />:null }
            </div>
        </div>
    )
}

export default SegmentDetail;