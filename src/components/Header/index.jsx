import React from "react";
import { Switch, Route } from 'react-router-dom';
import ApiClient from 'stores/api-client';

import Language from "components/Language";
import ENV from 'config';

const HeaderOld = () => {
  return (
    <header className="header">
      <div className="brand-bar">
        <a href='https://www.ttsviajes.com' className="brand-bar__logo-link">
          <img src={require('assets/img/logo.svg')} alt="TTS Logo" className="brand-bar__logo"/>
        </a>
        <div className="brand-bar__phone">
          <div className="brand-bar__phone-number">
            <svg className="brand-bar__phone-icon">
              <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-phone`}></use>
            </svg>
            <Language resource="PHONE"/>
          </div>
          <div className="brand-bar__phone-times">
            <Language resource="CONTACT_TIMES"/>
          </div>
        </div>
        <div className="brand-bar__branches">
          <svg className="brand-bar__icon">
            <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-location`}></use>
          </svg>
          <a href="http://sucursales.ttsviajes.com/"><Language resource="BRANCHES"/></a>
        </div>
        <div className="brand-bar__user" >
          <svg className="brand-bar__icon">
            <use xlinkHref={`${require('assets/img/sprite.svg')}#icon-profile`}></use>
          </svg>
        </div>
      </div>
      <Switch>
          <Route exact path="/thanks/*" render={() => null} />
          <Route exact path="/checkout/*" render={() => null} />
          <Route exact path="/*" render={() => null} />
      </Switch>
    </header>
  )
};

class Header extends React.Component {
  state = {
    html: '<div></div>'
  }
  componentDidMount(){
    ApiClient.get(ENV.URLS.GETHEADER)
    .then(response => {
       return response;
    })
    .then(urlresponse => {
     if(urlresponse.data){
       this.setState({html:urlresponse.data})
     }
  });
  }

  getHtml(){
    return {__html: this.state.html};
  }
  render(){
    return(
      <div>
          <div dangerouslySetInnerHTML={this.getHtml()} ></div>
      </div>
    )
  }
  
}

export default Header;
