import React from "react";
import ReactGA from 'react-ga';
import { inject, observer } from "mobx-react";
import { animateScroll } from 'react-scroll'
import {Form} from 'components/Checkout';
import {Summary,SummaryMobile} from 'components/Checkout/Summary';
import { StickyContainer, Sticky } from 'react-sticky';
//import CheckoutPlaceholder from 'components/Checkout/placeholder';
import ENV from 'config';
import ApiClient from '../../stores/api-client';
import moment from 'moment';

import Responsive from 'react-responsive-decorator';


function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

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
        checkContact: false,
        scrolled:false,
        isMobile:false
    }

    thanksPage = (status) => {
        let thanks = status ==='thankscontact'?'thankscontact':'thanks';
        const thanksUrl = ENV.SUBCHANNEL==='tts'?`/${thanks}/${this.props.match.params.id}`:`/${ENV.SUBCHANNEL}/${thanks}/${this.props.match.params.id}`
        this.props.history.push(thanksUrl, {
            status: status
        });
    }

    componentDidMount() {
        let clusterID = this.props.match.params.id;
        let product = this.props.match.params.product;
        let trackID = 123;
        const queryString = this.props.location.search!==''?parseQuery(this.props.location.search):null;
        const points = queryString && queryString.points?queryString.points:null;
        this.props.checkout.retrieveCheckoutInfo(clusterID, product,trackID,points).then(
           (res)=>{
               this.setState({loadingReservation:false})
           },
           ()=>console.log('fallo')
       )
      
        this.props.media({ maxWidth: 600 }, () => {
            this.setState({
                isMobile: true
            })
        })

        window.addEventListener('scroll', ()=>{
           const isTop = window.scrollY<100;
           if(isTop !== true){
                this.setState({scrolled:true})            
           }else{
                this.setState({scrolled:false})
           }
        })
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
        //this.setState({loading:true})
       this.props.checkout.doPayment();
    }
   
    render() {
        const { error, availablePayment, loading, retrievingPms, productType,loadingReservation,reservationCode, checkContact} = this.state;
      return (
            <StickyContainer>
                {!loadingReservation?
                    <div id="checkout-container">
                        <div className="section-checkout">
                            <Form 
                                error={error}
                                action={this.doPayment}
                                loading={loading}
                                />
                            {this.state.isMobile?
                            <SummaryMobile 
                                scrolled={this.state.scrolled}
                            />
                            
                            :
                                <Summary 
                                    scrolled={this.state.scrolled}
                                />
                            }
                        </div>
                    </div>
                :null
                }
            </StickyContainer>
        )
    }
}

export default Responsive(Checkout);