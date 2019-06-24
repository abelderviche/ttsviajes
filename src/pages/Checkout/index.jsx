import React from "react";
import ReactGA from 'react-ga';
import { inject, observer } from "mobx-react";
import { animateScroll } from 'react-scroll'
import {Form} from 'components/Checkout';
import Error from 'components/Checkout/Error';



import {Summary,SummaryMobile} from 'components/Checkout/Summary';
import { StickyContainer, Sticky } from 'react-sticky';
import CheckoutPlaceholder from 'components/Checkout/placeholder';
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
        const clusterID = this.props.match.params.id;
        const product = this.props.match.params.product;
        const points = this.props.match.params.sellPoints;
        const idGetPoints = this.props.match.params.idGetPoints;
        const channelMotor = this.props.match.params.channelMotor;
        /*const queryString = this.props.location.search!==''?parseQuery(this.props.location.search):null;
        const points = queryString && queryString.points?queryString.points:null;
        const idGetPoints = queryString && queryString.idGetPoints?queryString.idGetPoints:null;*/
        this.props.billing.retrieveData();

        this.props.checkout.retrieveCheckoutInfo(clusterID, product,idGetPoints,points).then(
           (res)=>{
                if(res.action === '1'){
                    this.setState({loadingReservation:false})
                   
               }else{
                    window.location.href = res.url;
               }
           },
           ()=>{
                this.setState({
                    loadingReservation:false,
                    error: {
                        title: "Ocurrió un error",
                        message: "Vuelva a intentarlo",
                        critical: "critical"
                    }
                })
           }
       )
      
        this.props.media({ maxWidth: 600 }, () => {
            this.setState({
                isMobile: true
            })
        })
        window.addEventListener('resize', ()=>{
            let mobile = false; 
            this.props.media({ maxWidth: 600 }, () => {
              mobile = true;
            })
            this.setState({
                isMobile: mobile
            })
                
        })

        window.addEventListener('scroll', ()=>{
           const isTop = window.scrollY<84;
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
        this.setState({loading:true})
    
       this.props.checkout.doPayment().then(
            res=>{
                const { status , message} = res;
                if(status===1){
                    console.log('PERFECTO')
                }else{
                    this.handleError(message);
                }
            },
            err=>{
                if (err && err.invalidFields) {
                    this.handleError("Algunos campos están incompletos.");
                } else {
                    this.thanksPage('PAYMENT_ERROR');
                }
            }
       );
    }
   
    render() {
        const { error, availablePayment, loading, retrievingPms, productType,loadingReservation,reservationCode, checkContact} = this.state;
      return (
                !loadingReservation?
                    error && error.critical?<Error {...this.state.error}/>:
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
                :
                <CheckoutPlaceholder />
                

        )
    }
}

export default Responsive(Checkout);