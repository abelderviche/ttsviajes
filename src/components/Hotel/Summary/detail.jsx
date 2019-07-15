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

const detailInfo = (label,icon,value) => (
    <div className="info">
        <div className="title">
                <svg className="info-icon">
                        <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-${icon}`}></use>
                </svg>
            {label}
        </div>
        <div className="label">{value}</div>
    </div>
)

const Detail = ({name,stars,image,address,checkin,checkout,nights,rooms,mealPlan,roomDetail,amenities}) => {
    let childAges = [];
   let adultsQty = 0;
   let childsQty = 0;

    for (let room of rooms) {
        if (room.childAges) {
        childAges.push(...room.childAges)
        adultsQty += room.capacity - room.childAges.length
        } else {
        adultsQty += room.capacity
        }
    }
    
    for (let childAge of childAges){
        childsQty++;
    }

    return (
        <div className="hotel-box">
            <div className="hotel-box__section description">
                <div className="image">
                    <img src={image.url} alt={name}/>
                </div>
                <div className="detail">
                    <div className="title">{name}</div>
                    <div className="stars">{getStars(stars)}</div>
                    <div className="direction">
                        <svg className="icon-location">
                                <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-location`}></use>
                        </svg>{address}
                    </div>
                </div>
                {/*

                    <div className="title">{name}</div>
                <div className="stars">{getStars(stars)}</div>
                <div className="direction">
                    <svg className="icon-location">
                            <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-location`}></use>
                    </svg>{direction}
                </div>
                */}
            </div>
            <div className="hotel-box__section  date">
                <div><svg className="icon-date">
                                <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-date`}></use>
                        </svg></div>
                <div>{checkin}</div>
                <div>
                    <img src={require('assets/img/arrow-reservas.png')} alt=""/>
                </div>
                <div>{checkout}</div>
            </div>
            <div className="hotel-box__section  guestrooms">
                {detailInfo('Adultos','person',adultsQty)}
                {detailInfo('Menores','child',childsQty)}
                {detailInfo('Habitaciones','hotels',rooms.length)}
                {detailInfo('Tipo','info',rooms[0].name)}
            </div>
        </div>
    )
}

export default Detail;