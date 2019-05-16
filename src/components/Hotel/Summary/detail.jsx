import React from 'react';

const getStars = (stars) =>{
    let starsArr = [];
    for (var i = stars - 1; i >= 0; i--) {
          starsArr.push(<svg className="icon-star" key={i}>
          <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-star`}></use>
        </svg>)
    }
    return starsArr;
}

const Detail = ({name,stars,direction,checkin,checkout,nights,rooms,mealPlan,roomDetail,amenities}) => {
    return (
        <div className="hotel-box">
            <div className="hotel-box__hotel-info">
                <div className="title">{name}</div>
                <div className="stars">{getStars(stars)}</div>
                <div className="direction">
                    <svg className="icon-location">
                            <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-location`}></use>
                    </svg>{direction}
                </div>
                {amenities.map((amenity,k)=>(<div key={k} className="meal-plan">{amenity.name}</div>))}
            </div>
            <div className="hotel-box__reservation-info">
                <div className="row">
                    <div>Tu reserva</div>
                    <div>{nights}, {rooms}</div>
                </div>
                <div className="row">
                    <div>Habitaciones</div>
                    <div>{roomDetail}</div>
                </div>
                <div className="row">
                    <div>Entrada</div>
                    <div>{checkin}</div>
                </div>
                <div className="row">
                    <div>Salida</div>
                    <div>{checkout}</div>
                </div>
            </div>
        </div>
    )
}

export default Detail;