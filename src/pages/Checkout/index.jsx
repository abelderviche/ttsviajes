import React from "react";
import ReactGA from 'react-ga';
import { inject, observer } from "mobx-react";
import { animateScroll } from 'react-scroll'
import {Form} from 'components/Checkout';
import Error from 'components/Checkout/Error';
import ErrorRedirect from 'components/Checkout/Error/error-redirect';



import {Summary,SummaryMobile} from 'components/Checkout/Summary';
import { StickyContainer, Sticky } from 'react-sticky';
import CheckoutPlaceholder from 'components/Checkout/placeholder';
import ENV from 'config';
import ApiClient from '../../stores/api-client';
import moment from 'moment';

import Responsive from 'react-responsive-decorator';

@inject('checkout', 'reservations', 'billing','assistcard','paymentMethod') @observer
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
        this.setState({productType:product})
        const points = this.props.match.params.sellPoints;
        const idGetPoints = this.props.match.params.idGetPoints;
        const channelMotor = this.props.match.params.channelMotor;
        /*const queryString = this.props.location.search!==''?parseQuery(this.props.location.search):null;
        const points = queryString && queryString.points?queryString.points:null;
        const idGetPoints = queryString && queryString.idGetPoints?queryString.idGetPoints:null;*/
        this.props.billing.retrieveData();

        this.props.checkout.retrieveCheckoutInfo(clusterID, product,idGetPoints,points).then(
           (res)=>{
               if(Number(res.action)  === 1){
                   this.setState({loadingReservation:false})
               }else if(Number(res.action) === 2){
                        this.setState({
                            error: {
                                title: "Ocurrió un error",
                                message: res.message,
                                url: res.url
                            }
                        });
                        animateScroll.scrollToTop(500);
                }else{
                    console.log("ocurrio un error", res);
                    if(process.env.REACT_APP_ENV==='prod'){  
                        window.location.href = res.url;
                    }else{
                        this.handleError('SOLO SE VE EN DEV Y QA ||| Ocurrio un error',`Action: ${res.action} | Message:${res.message} | Url:${res.url}`,true);
                    }
               }
           },
           ()=>{
                this.setState({
                    loadingReservation:false,
                    error: {
                        title: "Ocurrió un error",
                        message: "Vuelva a intentarlo",
                        critical: true
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

    scrollTo = (elementId) =>{
        animateScroll.scrollTo(document.getElementById(elementId).offsetTop,{duration:500})
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
            /**
             * check if hay inputs errors
            */
           document.getElementsByClassName("module__input-errors").length>0?
            animateScroll.scrollTo(document.getElementsByClassName("module__input-errors")[0].offsetTop,{duration:500})
            :animateScroll.scrollToTop(500);
            /*animateScroll.scrollToTop({
                duration: document.getElementsByClassName("module__input-errors")[0].offsetTop
            });*/
        }, 1000);
    }

    

    doPayment = () => {
        this.setState({loading:true})
        this.props.checkout.doPayment().then(
                res=>{
                    const { action , message, data} = res;
                    if(Number(action)===3){
                        this.handleError(message);
                    }else if(Number(action)===2){
                        setTimeout(() => {
                            this.setState({ loading: false });
                            this.setState({
                                error: {
                                    title: "Ocurrió un error",
                                    message: "Volver a buscar",
                                    url: data
                                }
                            });
                            animateScroll.scrollToTop(500);
                        }, 1000);
                    }else{
                        this.setState({loading:false})
                        if(data!==''){
                            window.location.href = data;
                        }

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
                error && error.critical?<Error {...this.state.error}/>:
                error && error.url?<ErrorRedirect {...this.state.error} />:
                !loadingReservation?
                    <div id="checkout-container">
                        <div className="section-title"><span>¡Asegurá tu lugar ahora!</span></div>
                        <div className="section-checkout">
                            <Form 
                                error={error}
                                action={this.doPayment}
                                loading={loading}
                                product={productType}
                                scrollTo={this.scrollTo}
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