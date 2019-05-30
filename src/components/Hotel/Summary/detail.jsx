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
        <div className="title"><div className="icon"></div>{label}</div>
        <div className="label">{value}</div>
    </div>
)

const Detail = ({name,stars,image,address,checkin,checkout,nights,rooms,mealPlan,roomDetail,amenities}) => {
    let childAges = [];
   let adultsQty = 0;
   let childsQty = 0;
   let infantsQty = 0;

    for (let room of rooms) {
        if (room.child_ages) {
        childAges.push(...room.child_ages)
        adultsQty += room.capacity - room.child_ages.length
        } else {
        adultsQty += room.capacity
        }
    }
    
    for (let childAge of childAges){
        if(childAge>3){
            childsQty++;
        }else{
            infantsQty++;
        }
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
                {detailInfo('Adultos','',adultsQty)}
                {detailInfo('Niños','',childsQty)}
                {detailInfo('Bebes','',infantsQty)}
                {detailInfo('Habitaciones','',rooms.length)}
                {detailInfo('Tipo','','Standard')}
            </div>
        </div>
    )
}

export default Detail;