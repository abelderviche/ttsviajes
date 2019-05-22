import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import PaxForm from '../../Flight/PaxForm';

@inject('guestsStore') @observer

class PaxModule extends Component {
     render(){
        const {guestsStore} = this.props;
        return(
            <div className="module">
                <div className="module__top-headline">Datos de los pasajeros aereos</div>   
                {guestsStore.guestsArray.map((room)=>
                    <PaxForm sendAttempted={this.props.sendAttempted} guest={room}  key={room.id}/>
                )}


            </div>
        )
    }
}

export default PaxModule;