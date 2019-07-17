import React from 'react';
import {Segment} from './segment';

const detailInfo = (label,icon,value) => (
    <div className="info">
        <div className="title">
                <svg className="info-icon">
                        <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-${icon}`}></use>
                </svg>
            {label}
        </div>
        <div className="label">{value}</div>
    </div>
)

class FlightSummary extends React.Component {

    state = {
        collapsed: true
    }

    render() {
        const { cluster } = this.props;
        const { collapsed } = this.state;
        const roundtrip = cluster.flightType === 'ROUND_TRIP';
        return (
            <div className={`flight noselect ${collapsed ? 'flight__collapsed' : ''}`} onClick={() => this.setState({collapsed: !collapsed})}>
                <div className="flight__headline">
                <span className="flight__headline-city">DETALLE DE TU SELECCIÓN</span>
                </div>
                <div className="flight-box">
                    <div className="flight-box__section segments">
                        {roundtrip ? 
                        <div className="segments">
                            <Segment data={cluster.segments[0]} type='outbound' pos={0} />
                            <Segment data={cluster.segments[1]} type='inbound' pos={1} />
                        </div>
                        :
                        <div className="segments">
                            {cluster.segments.map((segment, i) => <Segment data={segment} pos={i} key={i}/>)}   
                        </div>

                        }
                    </div>
                    <div className="flight-box__section pax">
                        {detailInfo('Adultos','person',cluster.price.adults? cluster.price.adults.quantity:0)}
                        {detailInfo('Niños','child',cluster.price.children? cluster.price.children.quantity:0)}
                        {detailInfo('Bebes','child',cluster.price.infants? cluster.price.infants.quantity:0)}
                    </div>
                    {/*roundtrip ? 
                    <div>
                        <Segment data={segments[0]} type='outbound' pos={0} />
                        <Segment data={segments[1]} type='inbound' pos={1} />
                    </div>
                    :
                    segments.map((segment, i) => <Segment data={segment} pos={i} key={i}/>)
                    */}
                    
                </div>
            </div>
        );
    }
}

export default FlightSummary;