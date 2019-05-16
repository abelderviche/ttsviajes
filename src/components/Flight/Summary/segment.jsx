import React from "react";
import moment from 'moment-timezone';
import SegmentDetail from './segment-detail';
moment.tz.setDefault("GMT");

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
                    departureTime={option.departure_time}
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

export default Segment;