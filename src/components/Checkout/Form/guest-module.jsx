import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import GuestForm from '../../Hotel/GuestForm';

@inject('guestsStore') @observer

class GuestModule extends Component {
     render(){
        const {guestsStore} = this.props;
        return(
            <div className="module">
                <div className="module__top-headline">Datos de los pasajeros</div>   
                {guestsStore.guestsArray.map((room,k)=>
                    <GuestForm sendAttempted={this.props.sendAttempted} guest={room}  key={`guestform-${k}`}  keyData={k+1}/>
                )}


            </div>
        )
    }
}

export default GuestModule;