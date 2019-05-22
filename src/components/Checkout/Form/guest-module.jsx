import React, { Component } from 'react'
import { inject, observer } from "mobx-react";
import GuestForm from '../../Hotel/GuestForm';

@inject('guestsStore') @observer

class GuestModule extends Component {
     render(){
        const {guestsStore} = this.props;
        console.log(guestsStore.guestsArray);
        return(
            <div className="module">
                <div className="module__top-headline">Datos de los pasajeros</div>   
                {guestsStore.guestsArray.map((room)=>
                    <GuestForm sendAttempted={this.props.sendAttempted} guest={room}  key={room.id}/>
                )}


            </div>
        )
    }
}

export default GuestModule;