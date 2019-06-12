import React from 'react';

//import Loader from 'components/Global/loader';
import Charges from './charges';
import ChargesHotel from './chargesHotel';
import ChargesPoints from './chargesPoints';
import FlightSummary from 'components/Flight/Summary';
import HotelSummary from 'components/Hotel/Summary';
import { inject, observer } from 'mobx-react';
import moment from 'moment';


@inject('checkout') @observer
class Summary extends React.Component {
    render() {
        const {infoProduct,activeComponents,points} = this.props.checkout;
        const rewards = activeComponents.find(f=>f.name==='POINT');
        const {type,detail} = infoProduct;
        if(type === 'accommodations'){
            const nights = moment(detail.rates[0].checkout).diff(moment(detail.rates[0].checkin), 'days');
            return(
                <div className={`summary`}>
                    {rewards?
                        <ChargesPoints points={points}/>
                        :
                        <ChargesHotel price={detail.rates[0].price}  nights={nights} rooms={detail.rooms.length}/> 
                    }
                    <HotelSummary />
                </div>
            )
        }else{
            return(
                <div className={`summary`}>
                    {rewards?
                        <ChargesPoints points={points}/>
                        :
                        <Charges price={detail.price} /> 
                    }
                    <FlightSummary cluster={detail} />

                </div>
            )
        }
    }
}
@inject('checkout') @observer

class SummaryMobile extends React.Component {
    state = {
        collapsed:true
    }

    toggleCollapsed = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }
    render() {
        const {infoProduct,activeComponents,points} = this.props.checkout;
        const rewards = activeComponents.find(f=>f.name==='POINT');
        const {type,detail} = infoProduct;
        return(
            <div className={`summary_mobile  ${this.props.scrolled?'summary_mobile__fixed':''}`}>
                {!this.state.collapsed?
                <div >
                    <ChargesPoints points={points}/>
                    <FlightSummary cluster={detail} />
                </div>
                :
                <div className="summary_mobile__line">
                    <span>Puntos a cambiar</span>
                    <span>{points}</span>
                </div>
                }
                <div className="showDetails" onClick={this.toggleCollapsed} >{!this.state.collapsed?'Ocultar':'Ver'} detalle de compra</div>
            </div>
        )
    }
}

export {Summary,SummaryMobile};