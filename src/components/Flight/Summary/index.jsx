import React from 'react';
import Segment from './segment';

class FlightSummary extends React.Component {

    state = {
        collapsed: true
    }

    render() {
        const { cluster } = this.props;
        const { segments } = cluster;
        const { collapsed } = this.state;
        const roundtrip = cluster.flight_type === 'ROUND_TRIP';
        return (
            <div className={`flight noselect ${collapsed ? 'flight__collapsed' : ''}`} onClick={() => this.setState({collapsed: !collapsed})}>
                <div className="flight__headline">
                    <span className="flight__headline-city">{segments[0].origin.code}</span>
                    <img alt={roundtrip ? "Ida y Vuelta" : "Solo Ida"} className="flight__headline-symbol" src={require(`assets/img/flights/${roundtrip ? 'roundtrip' : 'oneway'}.svg`)} />
                    <span className="flight__headline-city">{segments[0].destination.code}</span>
                </div>
                <div className="flight__segments">
                    {roundtrip ? 
                    <div>
                        <Segment data={segments[0]} type='outbound' pos={0} />
                        <Segment data={segments[1]} type='inbound' pos={1} />
                    </div>
                    :
                    segments.map((segment, i) => <Segment data={segment} pos={i} key={i}/>)
                    }
                    
                </div>
            </div>
        );
    }
}

export default FlightSummary;