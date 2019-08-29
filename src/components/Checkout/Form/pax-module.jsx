import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import PaxForm from '../../Flight/PaxForm';

@inject('guestsStore') @observer

class PaxModule extends Component {
     render(){
        const {guestsStore} = this.props;
        return(
            <div className="module">
                <div className="module__top-headline">Datos de los pasajeros</div>   
                {guestsStore.paxArray.map((pax,k)=>
                    <PaxForm sendAttempted={this.props.sendAttempted} pax={pax} key={k} keyData={k} />
                )}


            </div>
        )
    }
}

export default PaxModule;