import React from 'react';

const formatPrice = (price) => {
    return price.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const CARDS = {
    "VI": "Visa",
    "CA": "Mastercard",
    "DC": "Diners",
    "AX": "American Express"
}

class PaymentInfo extends React.Component {

    render () {
    //    let reservationTotal = this.props.reservations.product.cluster.price.total;
       
        let {payments, mobile,productName,reservationTotal,hasAssistcard} = this.props;
        console.log(payments);
        const paidProducts = payments.reduce((acum,val,i)=>{
            if(val.payment_type.definition.commerce && val.payment_type.definition.commerce.includes(('Asistencia'))){
                acum['assistance'] = parseFloat((acum['assistance'] + val.amount.total).toFixed(2));
                acum['total'] = parseFloat((acum['total'] + val.amount.total).toFixed(2));
                acum['installments'].push({'price':val.amount.total,'installments':val.payment_type.definition.installments});
            }else{
                acum['products'] = parseFloat((acum['products'] + val.amount.total).toFixed(2));
                acum['total'] = parseFloat((acum['total'] + val.amount.total).toFixed(2));
                acum['currency'] = val.amount.currency;
                acum['bank'] = val.payment_type.definition.bank;
                acum['brand'] = val.payment_type.definition.brand;
                acum['installments'].push({'price':val.amount.total,'installments':val.payment_type.definition.installments});
            }
            return acum;
        },{
            'assistance':0,
            'products':0,
            'currency':'',
            'bank':'',
            'brand':'',
            'installments':[],
            'total':0,
        });

        let onePayment = 0;
        let splitPayments = 0;
        let dues = 0;
      /* paidProducts.installments = [
           {'price':2000,'installments':1},
           {'price':20000,'installments':1},
       ]*/
        if(paidProducts.installments || paidProducts.installments.length>1){
            paidProducts.installments.forEach(element => {
                if(element.installments===1){
                    onePayment+=element.price;
                    
                }else{
                    splitPayments+=element.price/element.installments;
                    //dues = element.installments;
                }
                dues = element.installments>dues?element.installments:dues;
            });
        }else{
            onePayment  = paidProducts.installments[0].price;
            dues        = paidProducts.installments[0].installments;
        }
        if( formatPrice(onePayment+splitPayments) === formatPrice(splitPayments)) {onePayment = splitPayments;splitPayments = 0;}
        
        const installmentPrice = formatPrice(paidProducts.total / paidProducts.installments);


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
                    DETALLE DEL PAGO:<span className="thanks__total--value">{paidProducts.currency} {formatPrice(paidProducts.total)}</span>
                </div>
                <div className="thanks__method">
                    {splitPayments>0?
                        <span className="thanks__method--installments">
                            Con {CARDS[paidProducts.brand]} de {paidProducts.bank} en 1 cuota de {paidProducts.currency} {formatPrice(onePayment+splitPayments)} +  {dues-1} cuotas de {paidProducts.currency} {formatPrice(splitPayments)}
                        </span>
                    :
                        <span className="thanks__method--installments">Con {CARDS[paidProducts.brand]} de {paidProducts.bank} en {dues} cuota{dues>1?'s':''} de {paidProducts.currency} {formatPrice(paidProducts.total / dues)}</span>
                    }
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
                        hasAssistcard?
                        <div className="thanks__detailspayments--product assistcard">
                         {paidProducts.assistance>0?
                            <div className="headline">
                                <img alt="flight" src="http://cdn.ttsviajes.com/img/logo-assistcard.png" className="thanks__detailspayments--icon" />
                                SEGURO: <span>{paidProducts.currency} {formatPrice(paidProducts.assistance)}</span>
                            </div>
                            :
                            <div className="headline">
                                <img alt="flight" src="http://cdn.ttsviajes.com/img/logo-assistcard.png" className="thanks__detailspayments--icon" />
                                SEGURO:
                            </div>
                            }
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
                {hasAssistcard && paidProducts.assistance===0?
                    <div className="thanks__detailspayments--error">
                        Te estaremos contactando para completar la operación
                    </div>
                :null}
            </div>
        )
    
    }
}

export default PaymentInfo;