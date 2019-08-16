import React from 'react';
import moment from 'moment-timezone';
import Detail from './detail';
import { inject, observer } from 'mobx-react';
moment.tz.setDefault("GMT");

@inject('checkout') @observer
class HotelSummary extends React.Component {

    state = {
        collapsed: true
    }

    render() {
        const { collapsed } = this.state;
        const { detail } = this.props.checkout.infoProduct;


        return (
            <div className={`hotel noselect ${collapsed ? 'hotel__collapsed' : ''}`}  onClick={() => this.setState({collapsed: !collapsed})}>
                <div className="hotel__headline">
                    <span className="hotel__headline-city">DETALLE DE TU SELECCIÓN</span>
                </div>
                    <Detail 
                        name={detail.accommodation.name}
                        image={detail.accommodation.images[0]}
                        //image={detail.accommodation.images.find(image=>image.name==="Imagen destacada")}
                        stars={detail.accommodation.stars}
                        address={detail.accommodation.address}
                        location={detail.accommodation.location}
                        rooms={detail.rooms}
                        checkin={moment(detail.rates[0].checkin).format('DD MMM	Y')}
                        checkout={moment(detail.rates[0].checkout).format('DD MMM Y')}
                    />
              </div>
        );
    }
}

export default HotelSummary;