import React from 'react';


const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const formatPoints = (price) => {
    return price?price.toFixed(0).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ","):null;
}
const CARDS = {
    "VI": "Visa",
    "CA": "Mastercard",
    "DC": "Diners",
    "AX": "American Express"
}

class PaymentInfoRewards extends React.Component {

    render () {
    //    let reservationTotal = this.props.reservations.product.cluster.price.total;
       
        let {payments, mobile,productName,reservationTotal,hasAssistcard} = this.props;
        const total = payments.reduce((acum,val,i)=>{
            return val.payment_type.type==='CARD'?acum+val.amount.total:acum
        },0)
        const points = payments.reduce((acum,payment,i)=>{return payment.payment_type.type==="REWARDS"?acum + payment.amount.total:acum},0);
        const maxDue = payments.reduce((acum,val,i)=>{
            return val.payment_type.type==='CARD'?acum>val.payment_type.definition.installments?acum:val.payment_type.definition.installments:acum;
        },0)
        const brand = payments && payments.length>0? payments.find(payment=> payment.payment_type.type==='CARD').payment_type.definition.brand: null;

        if (!payments || !payments.length) {
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
                            hasAssistcard?
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

        //!((hasAssistcard && paidProducts.assistance===0) || (reservationTotal!==paidProducts.products))?this.setState({showSubtitle:true}):null;
        return (
            <div className={`thanks__box thanks__payment ${mobile ? 'no-margin' : ''}`}>
                <div className="thanks__total">
                    DETALLE DEL CANJE
                </div>
                <div className="thanks__method">
                        <span className="thanks__method--installments">
                            {/* Con {CARDS[paidProducts.brand]} de {paidProducts.bank} en 1 cuota de {paidProducts.currency} {formatPrice(onePayment+splitPayments)} +  {dues-1} cuotas de {paidProducts.currency} {formatPrice(splitPayments)}  */}
                            {formatPoints(points)} puntos canjeados + {maxDue} cuota{maxDue>1?'s':''} ARS {formatPrice(total/maxDue)} con la tarjeta {CARDS[brand]}
                        </span>
                </div>
                <div className="thanks__detailspayments">
                    <div className="thanks__detailspayments--product">
                        <div className="cobro">
                            Canje exitoso
                        </div>
                    </div>
                </div>
            </div>
        )
    
    }
}

export default PaymentInfoRewards;