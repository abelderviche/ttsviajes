import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import { animateScroll } from 'react-scroll'

const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(',', '.').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
@inject('assistcard') @observer

export default class AssistcardModule extends Component {
    render() {
        return (
            <div>
                {this.props.assistcard.availableProducts.map((assist,k)=> 
                    <div className="module" key={`assist-${k}`}>
                        <div className="module__assistcard">
                            <div className="module__assistcard--container">
                                <div className="logo">
                                    <img src="https://cdn.ttsviajes.com/img/logo-assistcard.png" alt=""/>
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
                                    <div dangerouslySetInnerHTML={{__html: (assist.observations)?assist.observations:'' }} />
                                </div>
                                <div className="price-container">
                                    <div className="oferta-assist">
                                        <div className="inside-oferta">
                                            <div  className="title">Oferta online</div>
                                            <div className="off">35% OFF</div>
                                            <div>Contratando ahora</div>
                                        </div>
                                    </div>
                                    <div className="price">ARS {formatPrice(assist.amount)}</div>
                                    <div className="disclaimer">
                                        <div>Adicional por seguro de viaje</div>
                                        <div>Descuento ya aplicado</div>
                                    </div>

                                    <div
                                        className="button" 
                                        onClick={()=>{
                                            // animateScroll.scrollToTop({
                                            //     duration: 500
                                            // });
                                            !this.props.assistcard.selectedProduct? this.props.assistcard.selectProduct(k):this.props.assistcard.removeProduct()}} >
                                        <span>
                                            {!this.props.assistcard.selectedProduct?'Agregar seguro':'Quitar seguro'}
                                        </span>
                                    </div>
                                   
                                
                                </div>
                            </div>

                            <div className={`module__assistcard--advertise ${!this.props.assistcard.selectedProduct? '' : 'module__assistcard--advertise-visible'}`}>
                                <svg className="module__top-advertise__icon">
                                    <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-info`}></use>
                                </svg> El costo de cobertura podría incluirse en su totalidad dentro de la primera cuota según el plan de pago que se elija.
                            </div>
                        </div>
                    </div>
                    )
                    }
            </div>
        )
    }
}