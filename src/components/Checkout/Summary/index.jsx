import React from 'react';

//import Loader from 'components/Global/loader';
import Charges from './charges';
import ChargesHotel from './chargesHotel';
import ChargesPoints from './chargesPoints';
import ChargesMobile from './chargesMobile';
import FlightSummary from 'components/Flight/Summary';
import HotelSummary from 'components/Hotel/Summary';
import { inject, observer } from 'mobx-react';
import moment from 'moment';


@inject('checkout') @observer
class Summary extends React.Component {
    render() {
        const {infoProduct,activeComponents,points,isRewards} = this.props.checkout;
        const rewards = isRewards;
        const {type,detail} = infoProduct;
        if(type === 'accommodations'){
            const nights = moment(detail.rates[0].checkout).diff(moment(detail.rates[0].checkin), 'days');
            return(
                <div className={`summary`}>
                    {rewards?
                        <ChargesPoints scrolled={this.props.scrolled} points={points}/>
                        :
                        <ChargesHotel scrolled={this.props.scrolled} price={detail.rates[0].price}  nights={nights} rooms={detail.rooms.length}/> 
                    }
                    <HotelSummary scrolled={this.props.scrolled} />
                </div>
            )
        }else{
            return(
                <div className={`summary`}>
                    {rewards?
                        <ChargesPoints points={points} scrolled={this.props.scrolled}/>
                        :
                        <Charges price={detail.price}  scrolled={this.props.scrolled}/> 
                    }
                    <FlightSummary cluster={detail} scrolled={this.props.scrolled} />

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
        const {infoProduct,activeComponents,points,isRewards} = this.props.checkout;
        const rewards = isRewards;
        const {type,detail} = infoProduct;
        const nights = type==='accommodations'?moment(detail.rates[0].checkout).diff(moment(detail.rates[0].checkin), 'days'):null;

        return(
            <div className={`summary_mobile  ${this.props.scrolled?'summary_mobile__fixed':''}`}>
                {!this.state.collapsed?
                <div >
                    {rewards?
                    <ChargesPoints points={points}/>:
                    type==='accommodations'?
                    <ChargesHotel price={detail.rates[0].price}  nights={nights} rooms={detail.rooms.length}/> :
                    <Charges price={detail.price} /> 
                    }
                    {type==='accommodations'? <HotelSummary />:<FlightSummary cluster={detail} />}
                </div>
                :
                <ChargesMobile 
                    price={type === 'accommodations'?detail.rates[0].price:detail.price}
                    points={points}
                    rewards={rewards}
                />
                }
                <div className="showDetails" onClick={this.toggleCollapsed} >{!this.state.collapsed?'Ocultar':'Ver'} detalle de compra </div>
            </div>
        )
    }
}

export {Summary,SummaryMobile};