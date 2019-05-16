import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import Partnerships from "./partnerships";

import Language from "components/Language";

const Reduced = () => {
  return (
    <div className="footer__bottom">
      <div className="footer__links">
        <div className="footer__column">
          <div className="footer__column--title-sm">Institucional</div>
          <div className="footer__column--title-sm"><Link to='/institucional' className='footer__link'>Presentación Comercial</Link></div>
          <div className="footer__column--item-sm">Términos y condiciones</div>
        </div>
        <div className="footer__column">
          <div className="footer__column--title-sm">Servicios</div>
          <div className="footer__column--item-sm">Corporativo</div>
          <div className="footer__column--item-sm">Eventos</div>
          <div className="footer__column--item-sm">Casamientos</div>
        </div>
        <div className="footer__column">
          <div className="footer__column--title-sm">RRHH</div>
          <div className="footer__column--item-sm">Trabajá con nosotros</div>
        </div>
        <div className="footer__column">
        <div className="footer__column--title-sm">
          <svg className="footer__column--phone-icon">
            <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-phone`}></use>
          </svg>
          <Language resource="PHONE_SALES"/>
        </div>
        <div className="footer__column--item-sm"><Language resource="PHONE"/></div>
        <div className="footer__column--item-sm"><Language resource="CONTACT_TIMES"/></div>
      </div>
      </div>
      <div className="footer__misc">
        <div className="footer__legal">
          <div className="footer__legal--stamp">
            <img src="https://cdn.ttsviajes.com/img/afip.jpg" alt="AFIP" />
          </div>
          <div className="footer__legal--stamp">
            <img src="https://cdn.ttsviajes.com/img/qrturismo.png" alt="AFIP" />
          </div>
          <div className="footer__legal--info">
            <div>TTS Viajes</div>
            <div>Operador Responsable Legajo EVT 202</div>
            <div>CUIT: 30-52115181-8</div>
          </div>
        </div>
        <div className="footer__social">
          <div className="footer__social--button">
            <svg className="footer__social--icon">
              <use xlinkHref={`${require('assets/img/social.svg')}#icon-twitter`}></use>
            </svg>
          </div>
          <div className="footer__social--button">
            <svg className="footer__social--icon">
              <use xlinkHref={`${require('assets/img/social.svg')}#icon-linkedin`}></use>
            </svg>
          </div>
          <div className="footer__social--button">
            <svg className="footer__social--icon">
              <use xlinkHref={`${require('assets/img/social.svg')}#icon-youtube`}></use>
            </svg>
          </div>
          <div className="footer__social--button">
            <svg className="footer__social--icon">
              <use xlinkHref={`${require('assets/img/social.svg')}#icon-facebook`}></use>
            </svg>
          </div>
          <div className="footer__social--button">
            <svg className="footer__social--icon">
              <use xlinkHref={`${require('assets/img/social.svg')}#icon-instagram`}></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

const Extended = () => {
  return (
    <div>
      <div className="footer__newsletter">
        <div className="footer__plane-trail-container">
          <img className="footer__newsletter--plane-trail" src={`${require('assets/img/plane-trail.svg')}`} alt=""/>
        </div>
        <div className="footer__newsletter--subscribe">Suscribite para recibir las mejores ofertas</div>
        <div className="footer__newsletter--input-container">
          <div className="footer__newsletter--input">
            <input className="footer__newsletter--input-text" placeholder="Ingresá tu e-mail"></input>
          </div>
          <div className="footer__newsletter--button">Enviar</div>
        </div>
        <div className="footer__plane-trail-container">
          <img src={`${require('assets/img/plane-trail-right.svg')}`} alt=""/>
          <img className="footer__newsletter--plane-send" src={`${require('assets/img/paper-plane.svg')}`} alt=""/>
        </div>
      </div>
      <Partnerships />
      <div className="footer__products">
        <div className="footer__links">
          <div className="footer__column">
            <div className="footer__column--title">Hoteles</div>
            <div className="footer__column--item">Hoteles en Brasil</div>
            <div className="footer__column--item">Hoteles en Miami</div>
            <div className="footer__column--item">Hoteles en USA</div>
            <div className="footer__column--item">Hoteles en Argentina</div>
          </div>
          <div className="footer__column">
            <div className="footer__column--title">Paquetes</div>
            <div className="footer__column--item">Paquetes a Brasil</div>
            <div className="footer__column--item">Paquetes a Miami</div>
            <div className="footer__column--item">Paquetes a Europa</div>
            <div className="footer__column--item">Paquetes a USA</div>
          </div>
          <div className="footer__column">
            <div className="footer__column--title">Cruceros</div>
            <div className="footer__column--item">Cruceros a Brasil</div>
            <div className="footer__column--item">Cruceros al Caribe</div>
            <div className="footer__column--item">Cruceros por Miami</div>
          </div>
          <div className="footer__column">
            <div className="footer__column--title">Especiales 2018</div>
            <div className="footer__column--item">Paquetes al mundial</div>
            <div className="footer__column--item">Escapadas</div>
            <div className="footer__column--item">Vacaciones 2018</div>
          </div>
        </div>
      </div>
      <Reduced />
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="footer">
      <Switch>
        <Route exact path="/:subchannel/thanks/*" component={Reduced} />
        <Route exact path="/:subchannel/checkout/*" component={Reduced} />
        <Route exact path="/*" component={Extended} />
      </Switch>
    </footer>
  )
};
  
export default Footer;
  