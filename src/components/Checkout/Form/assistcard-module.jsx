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
                                <ul>
                                    <li>Asist. Médica en caso de Accidente * Hasta USD 60,000</li>
                                    <li>Asist. Médica en caso de Enfermedad no preexistente * Hasta USD 60,000</li>
                                    <li>Primera Atención Médica en caso de Enfermedad preexistente * Hasta USD 300</li>
                                </ul>
                            </div>
                            <div className="price-container">
                                <div className="price">ARS {formatPrice(assist.amount)}</div>
                                <div
                                    className="button" 
                                    onClick={()=>{
                                        animateScroll.scrollToTop({
                                            duration: 500
                                        });
                                        !this.props.assistcard.selectedProduct? this.props.assistcard.selectProduct(k):this.props.assistcard.removeProduct()}} >
                                    <span>
                                        {!this.props.assistcard.selectedProduct?'Deseo cobertura':'No deseo cobertura'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                    }
            </div>
        )
    }
}
