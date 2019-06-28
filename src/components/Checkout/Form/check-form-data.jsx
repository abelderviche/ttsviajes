import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
@inject('guestsStore','checkout') @observer
export default class CheckFormData extends Component {
    showPax = (name,lastname,docnumber) =>{
        return(
        <div className="resume-pax-data">
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
                    <div>Salida: <span>{infoProduct.detail.segments[0].departure_date}</span></div>
                    <div>Vuelta: <span>{infoProduct.detail.segments[1].departure_date}</span></div>
                </div>                
                <div className="resume-title">Pasajeros</div>
                <div className="resume-pax">
                    {paxArray.map(p=>this.showPax(p.firstName,p.lastName,p.document.number))}
                </div>
            </div>
        )
    }
}
