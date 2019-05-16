import React from "react";
import ReactGA from 'react-ga';
import { inject, observer } from "mobx-react";
import Responsive from 'react-responsive-decorator';

import Segment from 'components/Flight/Summary/segment';
import Loader from 'components/Global/loader';
import Detail from 'components/Hotel/Summary/detail';
import PaymentInfo from 'components/Thanks/payment-info';
import moment from 'moment-timezone';
import ENV from 'config';

moment.tz.setDefault("GMT");


const formatPrice = (price) => {
    return price.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const CARDS = {
    "VI": "Visa",
    "CA": "Mastercard",
    "DC": "Diners",
    "AX": "American Express"
}

@inject('application', 'reservations', 'language','assistcard') @observer
class Thanks extends React.Component {

    state = {
        isMobile: false,
        hasAssistcard:false,
        showSubtitle:false
    }

    componentDidMount() {
        const { flight, reservation } = this.props.reservations;
        if (!flight || !reservation) {
            this.props.reservations.retrieveReservation(this.props.match.params.id).then(
                (reservationData) => {
                    if(process.env.REACT_APP_ENV==='prod'){  
                        ReactGA.initialize('UA-50514512-8',{debug:false});
                        ReactGA.pageview(`/payment/${ENV.SUBCHANNEL}/thanks/${reservationData.typeProduct.translate_plural}`);
                    }
                    //checkeo si tiene assistencia la reserva
                    reservationData.reservation.messages.find(m => m.text.includes(('Incluye asistencia')))? this.setState({hasAssistcard:true}):null;
                    reservationData.reservation.messages.map(mess => {
                        if(mess.text.includes(('Incluye asistencia'))){
                            this.setState({hasAssistcard:true});
                               this.props.assistcard.getPaidProduct(this.props.match.params.id,mess.text.replace('Incluye asistencia: ','')).then(
                                ()=>{console.log('assistcardLoaded')},
                                ()=>{console.log('error assistcard')}
                            )
                            
                        }
                    });
                },
                () => console.log('reserva no encontrada')//this.handleError("La reserva no fue encontrada!", "", true)  
            );
        }
        this.props.media({ maxWidth: 600 }, () => {
            this.setState({
                isMobile: true
            })
        })
    }

    renderFlightSummary(flight) {
        if (!flight) return null;
        const { segments } = flight.cluster;
        const roundtrip = flight.cluster.flight_type === 'ROUND_TRIP';
        return (
            <div className="thanks__flight">
                {roundtrip ? 
                <div className="thanks__flight--segments">
                    <Segment flat={!this.state.isMobile} data={segments[0]} type='outbound' pos={0} showExtendedDetail={true}/>
                    <Segment flat={!this.state.isMobile} data={segments[1]} type='inbound' pos={1}  showExtendedDetail={true}/>
                </div>
                :
                <div className="thanks__flight--segments">
                    {segments.map((segment, i) => <Segment flat={!this.state.isMobile} data={segment} pos={i} key={i} showExtendedDetail={true} />)}
                </div>
                }
                
            </div>
        )
    }

    renderPassengers(passengers) {
        if (!passengers || !passengers.length) {
            return null;
        }
        return (
            <div className="thanks__passengers">
                <span className="thanks__passengers--title">Pasajeros</span>
                {passengers.map(p => {
                    return (
                        <div className="thanks__passenger" key={`passenger-${p.document.number}`}>
                            <div className="thanks__passenger--col">
                                <span className="thanks__passenger--value">{p.firstname} {p.lastname}</span>
                            </div>
                            <div className="thanks__passenger--col">
                                <span className="thanks__passenger--label">{p.document.type}:</span>
                                <span className="thanks__passenger--value">{p.document.number}</span>
                            </div>
                            <div className="thanks__passenger--col">
                                <span className="thanks__passenger--label">Fecha de nac.:</span>
                                <span className="thanks__passenger--value">{p.birth}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    }

    renderPayments(payments) {
        if (!payments || !payments.length) {
            return null;
        }
        const payment = payments[0];
        const { definition } = payment.payment_type;
        const installmentPrice = formatPrice(payment.amount.total / definition.installments);
        return (
            <div className="thanks__payment thanks__box">
                <div className="thanks__subtitle">Forma de pago</div>
                <div className="thanks__payment-info">
                    <div className="thanks__total">
                        <span className="thanks__total--headline">TOTAL</span>
                        <span className="thanks__total--value">{payment.amount.currency} {formatPrice(payment.amount.total)}</span>
                    </div>
                    <div className="thanks__method">
                        <span className="thanks__method--card">Con {CARDS[definition.brand]} de {definition.bank}</span>
                        <span className="thanks__method--installments">{definition.installments} cuotas de {payment.amount.currency} {installmentPrice}</span>
                    </div>
                </div>
            </div>
        );
    }

    renderGeneralInfo = (payments, mobile,productName) => {
        let reservationTotal = this.props.reservations.product.cluster.price.total;
       
        const paidProducts = payments.reduce((acum,val,i)=>{
            if(val.payment_type.definition.commerce.includes(('Asistencia'))){
                acum['assistance'] = parseFloat((acum['assistance'] + val.amount.total).toFixed(2));
                acum['total'] = parseFloat((acum['total'] + val.amount.total).toFixed(2));
            }else{
                acum['products'] = parseFloat((acum['products'] + val.amount.total).toFixed(2));
                acum['total'] = parseFloat((acum['total'] + val.amount.total).toFixed(2));
                acum['currency'] = val.amount.currency;
                acum['bank'] = val.payment_type.definition.bank;
                acum['brand'] = val.payment_type.definition.brand;
                acum['installments'] = val.payment_type.definition.installments;
            }
            return acum;
        },{
            'assistance':0,
            'products':0,
            'currency':'',
            'bank':'',
            'brand':'',
            'installments':'',
            'total':0
        });
        const installmentPrice = formatPrice(paidProducts.total / paidProducts.installments);

        /*console.log('reservationTotal',reservationTotal);
        console.log('paidProducts.products',paidProducts.products);
*/

        if ((!payments || !payments.length) || reservationTotal!==paidProducts.products) {
            return (
                <div className={`thanks__box thanks__payment ${mobile ? 'no-margin' : ''}`}>
                <div className="thanks__detailspayments">
                    <div className="thanks__detailspayments--product">
                        <div className="headline">
                            <img alt="flight" src={require('assets/img/flights/outbound.svg')} className="thanks__detailspa--icon" />
                            {productName==='FLIGHT'?'AÉREO':'HOTEL'}
                        </div>
                        <div className="cobro--error">
                            No pudimos realizar el cobro del aéreo
                        </div>
                    </div>
                    {
                        this.state.hasAssistcard?
                        <div className="thanks__detailspayments--product assistcard">
                            <div className="headline">
                                <img alt="flight" src="http://cdn.ttsviajes.com/img/logo-assistcard.png" className="thanks__detailspayments--icon" />
                                SEGURO
                            </div>
                            <div className="cobro--error">
                                No pudimos realizar el cobro del seguro
                            </div>
                        </div>
                    :null}
                </div>
                <div className="thanks__detailspayments--error">
                    Te estaremos contactando para completar la operación
                </div>
            </div>
            );
        }

        //!((this.state.hasAssistcard && paidProducts.assistance===0) || (reservationTotal!==paidProducts.products))?this.setState({showSubtitle:true}):null;
        return (
            <div className={`thanks__box thanks__payment ${mobile ? 'no-margin' : ''}`}>
                <div className="thanks__total">
                    DETALLE DEL PAGO:<span className="thanks__total--value">{paidProducts.currency} {formatPrice(paidProducts.total)}</span>
                </div>
                <div className="thanks__method">
                    <span className="thanks__method--installments">Con {CARDS[paidProducts.brand]} de {paidProducts.bank} en {paidProducts.installments} cuota{paidProducts.installments>1?'s':''} de {paidProducts.currency} {installmentPrice}</span>
                </div>
                <div className="thanks__detailspayments">
                    <div className="thanks__detailspayments--product">
                        <div className="headline">
                            <img alt="flight" src={require('assets/img/flights/outbound.svg')} className="thanks__detailspa--icon" />
                            {productName==='FLIGHT'?'AÉREO':'HOTEL'}: <span>{paidProducts.currency} {formatPrice(paidProducts.products)}</span>
                        </div>
                        {paidProducts.products>0?
                            <div className="cobro">
                                Cobro exitoso
                            </div>
                        :
                        <div className="cobro--error">
                            No pudimos realizar el cobro del aéreo
                        </div>}
                    </div>
                    {
                        this.state.hasAssistcard?
                        <div className="thanks__detailspayments--product assistcard">
                            <div className="headline">
                                <img alt="flight" src="http://cdn.ttsviajes.com/img/logo-assistcard.png" className="thanks__detailspayments--icon" />
                                SEGURO: <span>{paidProducts.currency} {formatPrice(paidProducts.assistance)}</span>
                            </div>
                            {paidProducts.assistance>0?
                                <div className="cobro">
                                    Cobro exitoso
                                </div>
                            :
                            <div className="cobro--error">
                                No pudimos realizar el cobro del seguro
                            </div>
                            }
                        </div>
                    :null}
                </div>
                {this.state.hasAssistcard && paidProducts.assistance===0?
                    <div className="thanks__detailspayments--error">
                        Te estaremos contactando para completar la operación
                    </div>
                :null}
            </div>
        )
    }

    renderSubtitle = (payments, contact) => {
        let message = `Confirmado el pago te enviaremos el ticket a: ${contact.email}`;
        if (!payments || !payments.length) {
            const { location } = this.props;
            if (location.state && location.state.status === 'PAYMENT_ERROR') {
                message = `Para finalizar la compra, uno de nuestros asesores se estará contactando a la brevedad`;
            } else {
                message = `Te estaremos contactando a la brevedad para finalizar la compra, si no, comunicate al ${this.props.language.getText('PHONE')}`;
            }
        }
        return (
            <div className="thanks__status">{message}</div>
        )
    }

    renderPnrBox(reservation_code, extraClass,productType) {
        const text = productType==='FLIGHT'?'Código de reserva':'Reserva'
        return (
            <div className={`thanks__box thanks__pnr ${extraClass}`}>
                <span className="thanks__subtitle">{text}</span>
                <span className="thanks__pnr--code">{reservation_code}</span>
            </div>
        )
    }

    renderDetail(reservationProduct,product){
        if(reservationProduct.type==='FLIGHT' && product){
            return(
                <div className="thanks__product thanks__box">
                    <div className="thanks__subtitle">
                    Detalle de tu vuelo: <span>{reservationProduct.pnr}</span>
                    </div>
                    {this.renderPassengers(reservationProduct.passengers)}
                    {this.renderFlightSummary(product)}
                </div>
            )
        }else if(reservationProduct.type==='ACCOMMODATION' && product){
            const {accommodation} = product;
            const nights = moment(accommodation.rate.checkout).diff(moment(accommodation.rate.checkin), 'days');
            return(
                <Detail 
                    name={accommodation.name}
                    stars={accommodation.stars}
                    direction={accommodation.address+', '+accommodation.city.name + (accommodation.phone?' / '+ accommodation.phone:'')}
                    checkin={`${moment(accommodation.rate.checkin).format('LLLL')} (Desde las ${accommodation.checkin.time})`}
                    checkout={`${moment(accommodation.rate.checkout).format('LLLL')} (Hasta las ${accommodation.checkout.time})`}
                    nights={nights>1?nights+' noches':nights+' noche'}
                    rooms={accommodation.rate.rooms.length>1?accommodation.rate.rooms.length+' habitaciones':accommodation.rate.rooms.length+' habitación'}
                    mealPlan={accommodation.rate.meal_plan}
                    roomDetail={accommodation.rate.rooms.length + ' X '+ accommodation.rate.rooms[0].name}
                    amenities={accommodation.rate.amenities?accommodation.rate.amenities:[]}
                />
            )
        }
    }
    render () {
        const { product, reservation, typeProduct } = this.props.reservations;
        if (!reservation && !typeProduct) {
            return <div id="thanks-container">
                <Loader />
            </div>;
        }
        const reservationProduct = reservation.products&& reservation.products.length>0? reservation.products[0]:null;
        const payments = reservation.payments;
        const reservation_code = typeProduct && typeProduct.product_name === 'FLIGHT'? reservationProduct.pnr:reservation.id;
        let assist = this.props.assistcard.availableProducts && this.props.assistcard.availableProducts.length>0?this.props.assistcard.availableProducts[0]:null;
        return (
            <div id="thanks-container">
                {typeProduct?
                    <div className="thanks">
                        <div className="thanks__title">
                            <img src={require('assets/img/thanks/check-circle.svg')} alt="Ok" />
                            <span>Gracias por confiar en TTS Viajes</span>
                        </div>
                        {this.state.showSubtitle?this.renderSubtitle(payments, reservation.contact):null}
                        <div className="thanks__reservation">
                            {   this.props.reservations.product?
                                    <PaymentInfo 
                                        payments={payments} 
                                        mobile={this.state.isMobile}
                                        productName={typeProduct.product_name}
                                        reservationTotal={ typeProduct.product_name === 'ACCOMMODATION'?this.props.reservations.reservation.products[0].price.total:this.props.reservations.product.cluster.price.total}
                                        hasAssistcard={this.state.hasAssistcard}
                                    />
                                    //this.renderGeneralInfo(payments, this.state.isMobile,typeProduct.product_name)
                                :null}
                            {!this.state.isMobile ? this.renderPnrBox(reservation_code, '',reservationProduct.type) : null}
                        </div>
                        {this.state.isMobile ? this.renderPnrBox(reservation_code, 'margin-bottom-16',reservationProduct.type) : null}
                        {this.renderDetail(reservationProduct,product)}
                        {this.state.hasAssistcard && assist?
                            <div className="module" key={`assist-`}>
                                <div className="module__assistcard">
                                    <div className="logo">
                                        <img src="http://cdn.ttsviajes.com/img/logo-assistcard.png" alt=""/>
                                        <div className="link-container">
                                            <div className="subtitle">
                                                Viajá protegido con Assist Card
                                            </div>
                                            <div className="links">
                                                <a target="_blank" href={assist.legalUrl}>Ver condiciones</a>
                                                <a target="_blank" href={assist.coverageUrl}>Ver cobertura completa</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="description">
                                        <div className="subtitle">
                                            Viajá protegido con Assist Card
                                        </div>
                                        <ul>
                                            <li>Asist. Médica en caso de Accidente * Hasta USD 60,000</li>
                                            <li>Asist. Médica en caso de Enfermedad no preexistente * Hasta USD 60,000</li>
                                            <li>Primera Atención Médica en caso de Enfermedad preexistente * Hasta USD 300</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        :null}
                    </div>
                :null}
            </div>
        );
    }
}

export default Responsive(Thanks);