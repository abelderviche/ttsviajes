import React from 'react';
import { inject, observer } from "mobx-react";

@inject('application') @observer
class  Partnerships extends React.Component {

    goToLink(link){
        window.location.href = link;
    }

    render() {
        const dataPartnerships = this.props.application.partnerships;
        return(
            <div className="footer__promotions">
                {dataPartnerships.map((partnership,k)=>{
                    return(
                        <div 
                            key={k}
                            className="footer__partnership" 
                            onClick={(e) => this.goToLink(partnership.link)}
                            style={{
                                backgroundColor:partnership.background_color
                            }}
                            >
                            <div className="footer__promo-logo" style={{backgroundImage:`url(${partnership.imagen[0].filename})`}}></div>
                            <div className="footer__promo-description">{partnership.texto}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
export default Partnerships;