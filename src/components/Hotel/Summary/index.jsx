import React from 'react';
import moment from 'moment-timezone';
import Detail from './detail';
moment.tz.setDefault("GMT");

class HotelSummary extends React.Component {

    state = {
        collapsed: true
    }

    render() {
        const { accommodation } = this.props;
        const { collapsed } = this.state;
        const nights = moment(accommodation.rate.checkout).diff(moment(accommodation.rate.checkin), 'days');
        return (
            <div className={`hotel noselect ${collapsed ? 'hotel__collapsed' : ''}`} onClick={() => this.setState({collapsed: !collapsed})}>
                <div className="hotel__headline">
                    <span className="hotel__headline-city">TU HOTEL</span>
                </div>
                <div className="hotel__details">
                    <Detail 
                        name={accommodation.name}
                        stars={accommodation.stars}
                        direction={accommodation.address+', '+accommodation.city.name + (accommodation.phone?' / '+ accommodation.phone:'')}
                        checkin={`${moment(accommodation.rate.checkin).format('LLLL')} (Desde las ${accommodation.checkin.time})`}
                        checkout={`${moment(accommodation.rate.checkout).format('LLLL')} (Hasta las ${accommodation.checkout.time})`}
                        nights={nights>1?nights+' noches':nights+' noche'}
                        rooms={accommodation.rate.rooms.length>1?accommodation.rate.rooms.length+' habitaciones':accommodation.rate.rooms.length+' habitación'}
                        mealPlan={accommodation.rate.meal_plan}
                        roomDetail={accommodation.rate.rooms.length + ' X '+ accommodation.rate.rooms[0].name}
                        amenities={accommodation.rate.amenities?accommodation.rate.amenities:[]}
                    />
                </div>
            </div>
        );
    }
}

export default HotelSummary;