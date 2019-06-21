import React from "react";
import moment from 'moment-timezone';
import SegmentDetail from './segment-detail';
moment.tz.setDefault("GMT");


const FlightCityDetail = ({code,name}) =>(
    <div className="city">
        <div className="code">
            {code}
        </div>
        <div className="description">
            {name}
        </div>
    </div>
);
const FlightDateDetail = ({hour,date}) =>(
    <div className="date">
        <div className="hour">
            {hour}
        </div>
        <div className="date">
            {date}
        </div>
    </div>
);

const FlightDetail = ({cityCode,cityName,hour,date})=>(
    <div className="col">
        <FlightCityDetail 
            code={cityCode}
            name={cityName}
        />
        <FlightDateDetail 
            hour={hour}
            date={date} 
        />
    </div>
)

class Segment extends React.Component {

    state = {
        collapsed: false
    }

    getLabel(type, pos) {
        if (type) {
            return type === 'outbound' ? 'Ida' : 'Vuelta';
        } else {
            return 'Tramo ' + pos+1;
        }
    }

    render() {
        const { data, type, pos, flat, showExtendedDetail} = this.props;
        const option = data.options[0];
        const plusDays = moment(option.arrival_date).diff(moment(option.departure_date), 'days');
        return (
            <div className={`segment ${type}`}>
                <FlightDetail 
                    cityCode =   {data.origin.code}
                    cityName =   {data.origin.name}
                    hour     =   {option.departure_time}
                    date     =   {moment(option.departure_date).format('DD MMM Y')} 
                />
                   
                <div className="col arrow">  
                    <div className="arrow-img">
                        <img src={require('assets/img/arrow-reservas.png')} alt=""/> 
                    </div>
                    <div className="airline">
                        <img className="airline--logo" src={`https://statics.basset.la/airlines/${option.legs[0].marketing_carrier.code}-ISO.svg`} alt={option.legs[0].marketing_carrier.code}/>
                        <span className="airline--name">{option.legs[0].marketing_carrier.name}</span>
                    </div>
                
                </div>
                <FlightDetail 
                    cityCode =   {data.destination.code}
                    cityName =   {data.destination.name}
                    hour     =   {option.arrival_time}
                    date     =   {moment(option.arrival_date).format('DD MMM Y')} 
                />
            </div>
           
        )
    }

}

class SegmentThanks extends React.Component {
    getLabel(type, pos) {
        if (type) {
            return type === 'outbound' ? 'Ida' : 'Vuelta';
        } else {
            return 'Tramo ' + pos+1;
        }
    }
    render() {
        const { data, type, pos, flat, showExtendedDetail} = this.props;
        const option = data.options[0];
        const plusDays = moment(option.arrival_date).diff(moment(option.departure_date), 'days');
        return (
            <div className="segment">
            <div className="segment__headline">
                <div className="segment__headline-desc">
                    <img alt={type || pos} src={require(`assets/img/flights/${type ? type : 'outbound'}.svg`)} className="segment__headline-desc--icon" />
                    <span className="segment__headline-label">{this.getLabel(type, pos)}</span>
                </div>
                <span className="segment__headline-label">{moment(data.departure_date).format('LLLL')}</span>
            </div>
            <SegmentDetail 
                flat={flat}
                origin={data.origin.code}
                destination={data.destination.code}
                departureTime={option.arrival_time}
                arrivalTime={option.arrival_time}
                legs={option.legs}
                luggage={option.baggage_allowance}
                duration={option.duration}
                plusDays={plusDays} 
                departureDate={moment(data.departure_date).format('LLLL')}
                arrivalDate={moment(option.arrival_date).format('LLLL')}
                extendedDetail={showExtendedDetail}
                />
        </div>
           
        )
    }
}
export {Segment,SegmentThanks};

{
    /*<div className="segment">
    <div className="segment__headline">
        <div className="segment__headline-desc">
            <img alt={type || pos} src={require(`assets/img/flights/${type ? type : 'outbound'}.svg`)} className="segment__headline-desc--icon" />
            <span className="segment__headline-label">{this.getLabel(type, pos)}</span>
        </div>
        <span className="segment__headline-label">{moment(data.departure_date).format('LLLL')}</span>
    </div>
    <SegmentDetail 
        flat={flat}
        origin={data.origin.code}
        destination={data.destination.code}
        departureTime={option.arrival_time}
        arrivalTime={option.arrival_time}
        legs={option.legs}
        luggage={option.baggage_allowance}
        duration={option.duration}
        plusDays={plusDays} 
        departureDate={moment(data.departure_date).format('LLLL')}
        arrivalDate={moment(option.arrival_date).format('LLLL')}
        extendedDetail={showExtendedDetail}
        />
</div>
*/}