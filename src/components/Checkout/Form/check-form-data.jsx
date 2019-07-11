import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import moment from 'moment';
import { animateScroll } from 'react-scroll'


@inject('guestsStore','checkout') @observer
export default class CheckFormData extends Component {
  
    showPax = (id,name,lastname,docnumber) =>{
        return(
        <div className="resume-pax-data" onClick={()=>this.props.scrollTo('pax-no-'+id)}>
            <div>Nombre: <span>{name}</span></div>
            <div>Apellido: <span>{lastname}</span></div>
            <div>DNI: <span>{docnumber}</span></div>
        </div>
    )}
    render() {
        let {guestsStore, checkout } = this.props;
        let { paxArray } = guestsStore;
        let { infoProduct } = checkout;
        return (
            <div className="module resume" >

                <div className="module__top-headline">Antes de finalizar revisá los datos ingresados</div>

                <div className="resume-title">Fecha</div>
                <div className="resume-date">
                    <div>Salida: <span>{moment(infoProduct.detail.segments[0].departure_date).format('DD MMM Y')}</span></div>
                    <div>Vuelta: <span>{moment(infoProduct.detail.segments[1].departure_date).format('DD MMM Y')}</span></div>
                </div>                
                <div className="resume-title">Pasajeros</div>
                <div className="resume-pax">
                    {paxArray.map((p,k)=>this.showPax(k,p.firstName,p.lastName,p.document.number))}
                </div>
            </div>
        )
    }
}
