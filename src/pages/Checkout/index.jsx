import React from "react";
import ReactGA from 'react-ga';
import { inject, observer } from "mobx-react";
import { animateScroll } from 'react-scroll'
import {Form,Summary} from 'components/Checkout';
import { StickyContainer, Sticky } from 'react-sticky';
/*import CheckoutPlaceholder from 'components/Checkout/placeholder';*/
import ENV from 'config';
import ApiClient from '../../stores/api-client';
import moment from 'moment';


@inject('checkout', 'reservations', 'billing','assistcard') @observer
class Checkout extends React.Component {

    state = {
        loading: false,
        error: undefined,
        availablePayment: false,
        retrievingPms: true,
        productType:false,
        loadingReservation:true,
        reservationCode:false,
        checkContact: false
    }

    thanksPage = (status) => {
        let thanks = status ==='thankscontact'?'thankscontact':'thanks';
        const thanksUrl = ENV.SUBCHANNEL==='tts'?`/${thanks}/${this.props.match.params.id}`:`/${ENV.SUBCHANNEL}/${thanks}/${this.props.match.params.id}`
        this.props.history.push(thanksUrl, {
            status: status
        });
    }

    componentDidMount() {
       let clusterID = 123;
       let product = 123;
       let trackID = 123;
       this.props.checkout.retrieveCheckoutInfo(clusterID, product,trackID).then(
           (res)=>{
               this.setState({loadingReservation:false})
           },
           ()=>console.log('fallo')
       )
    }

    handleError = (title, message, critical) => {
        setTimeout(() => {
            this.setState({ loading: false });
            this.setState({
                error: {
                    title: title,
                    message: message,
                    critical: critical
                }
            });
            animateScroll.scrollToTop({
                duration: 500
            });
        }, 1000);
    }

    

    doPayment = () => {
       
    }
   
    render() {
        const { error, availablePayment, loading, retrievingPms, productType,loadingReservation,reservationCode, checkContact} = this.state;
      return (
            <StickyContainer>
                {!loadingReservation?
                <div className="checkout-container">
                    <div className="section-checkout">
                        <Form 
                            error={error}
                        />
                        <Summary />
                    </div>
                </div>
                :null
                }
            </StickyContainer>
        )
    }
}

export default Checkout;