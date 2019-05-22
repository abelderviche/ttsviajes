import React from 'react';

//import Loader from 'components/Global/loader';
import Charges from './charges';
import ChargesHotel from './chargesHotel';
import FlightSummary from 'components/Flight/Summary';
import HotelSummary from 'components/Hotel/Summary';
import { inject, observer } from 'mobx-react';
import moment from 'moment';


@inject('checkout') @observer
class Summary extends React.Component {
    render() {
        const {infoProduct} = this.props.checkout;
        const {type,detail} = infoProduct;
        if(type === 'accommodations'){
            const nights = moment(detail.rates[0].checkout).diff(moment(detail.rates[0].checkin), 'days');
            return(
                <div className="summary">
                    <ChargesHotel price={detail.rates[0].price}  nights={nights} rooms={detail.rooms.length}/> 
                    
                </div>
            )
        }else{
            return(
                <div>asdasdasdasdasdasd</div>
            )
        }
      /*  const { retrievingPms, reservations } = this.props;
        const  productInfo  = reservations.product;
        if (productInfo && !retrievingPms && reservations.reservation.products[0].type === "FLIGHT") {
            return (
                <div className="summary">
                    <Charges price={productInfo.cluster.price} /> 
                    <FlightSummary cluster={productInfo.cluster} />
                </div>
            );
        }else if (productInfo && !retrievingPms && reservations.reservation.products[0].type === "ACCOMMODATION") {
            const nights = moment(productInfo.accommodation.rate.checkout).diff(moment(productInfo.accommodation.rate.checkin), 'days');
            const mandatory_tax =productInfo.accommodation.rate.price.price_detail.fees.reduce((acc, charge) =>{ 
                return acc + (charge.type==="mandatory_tax" ? charge.amount: 0)
            }, 0);
            return(
                <div className="summary">
                    <ChargesHotel price={productInfo.accommodation.rate.price}  nights={nights} rooms={reservations.reservation.products[0].rooms_qty}/> 
                    {productInfo.accommodation.rate.price.price_detail.fees  &&  productInfo.accommodation.rate.price.price_detail.fees.length > 0?
                        <div className="summary__not-include">
                            <div className="title">No incluye:</div>
                                <div className="item">{`- Impuestos de ciudad/destino: ${productInfo.accommodation.rate.price.price_detail.fees[0].currency} ${mandatory_tax}`}</div>
                        </div>
                        :null
                    }
                    <HotelSummary accommodation={productInfo.accommodation} />
                </div>
            )
        } else {
            return (
                <div className="summary">
                    <Loader />
                </div>
            );
        }*/
    }
}

export default Summary;