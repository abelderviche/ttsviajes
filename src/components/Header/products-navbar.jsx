import React from "react";
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import classnames from 'classnames/bind';

import Language from "components/Language";

// Hardcodeado hasta que se implementen los controles
const PRODUCTS = [ 'flights', 'hotels', 'packages', 'cars' ];

const linkStyles = {
  item: 'nav-bar__item',
  active: 'nav-bar__item--active'
}

const cx = classnames.bind(linkStyles);

const renderLink = (product, route) => {
  const matchesRoute = route === `/${product}` || (product === 'flights' && route === '/');
  return (
    <li key={`${product}-link`} className={cx('item', { active: matchesRoute })}>
      <Link to={`/${product}`} className="nav-bar__link">
        <svg className="nav-bar__icon">
          <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-${product}`}></use>
        </svg>
        <span className="nav-bar__text"><Language resource={`${product.toUpperCase()}`}/></span>
      </Link>
      <CSSTransition appear={true} in={matchesRoute} classNames="nav-bar__item-active-border" timeout={300} >
        <div className="nav-bar__item-active-border"></div>
      </CSSTransition>
    </li>
  )
}

const ProductsNavbar = ({location}) => {
    return (
        <nav className="nav-bar">
            <ul className="nav-bar__list">
            {PRODUCTS.map((product) => renderLink(product, location.pathname))}
            </ul>
        </nav>
    )
};

export default ProductsNavbar;