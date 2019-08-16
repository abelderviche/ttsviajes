import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Checkout from '../pages/Checkout';
import Thanks from '../pages/Thanks';
import ThanksContact from '../pages/Thanks/index-contact';
import Header from 'components/Header';
import Footer from 'components/Footer';

class ErrorPage extends React.Component{
    render(){
        return(
            <div className="errorPage"
                style={{
                    background:'url(https://www.ttsviajes.com/img/404.jpg)',
                    backgroundSize:'cover',
                    width: '100%',
                    display:'flex',
                    height:'90.8vh',
                    alignItems:'center',
                    justifyContent:'flex-end'
                    }}
            >
                   <div>
                        <h2>Página no encontrada :(</h2>           
                        Puede ir a la página de inicio y lo ayudaremos a encontrar los mejores destinos y financiación para su próximo viaje
                   </div>
            </div>
        )
    }
}
class Main extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path='/header' component={Header} />
                <Route exact path='/footer' component={Footer} />
                <Route exact path='*' render={() => (
                    <div id="app">
                    <Header route={this.props.match.url}/>
                    <main>
                        <Switch>
                            <Route exact path='/storage/:clientID/:action' render={(props) => {
                                    if(props.match.params.action === 'd') {
                                        localStorage.removeItem('ID-TTS-R');
                                    } else {
                                        localStorage.setItem('ID-TTS-R', props.match.params.clientID);
                                    }
                                    //window.parent.postMessage('successfuly authenticated', '');
                                    return <div>SETEANDO LS</div>;
                                }
                            } />

                            
                            <Route exact path='/thanks/:id/1' component={Thanks} />
                            <Route exact path='/:subchannel/thanks/:id/1' component={Thanks} /> 
                            <Route exact path='/thanks/:id/4' component={Thanks} />
                            <Route exact path='/:subchannel/thanks/:id/4' component={Thanks} /> 
                            <Route exact path='/checkout/:product/:id/:channelMotor' component={Checkout} />
                            <Route exact path='/checkout/:product/:id/:idGetPoints/:sellPoints/:channelMotor' component={Checkout} />
                            <Route exact path='/:subchannel/checkout/:product/:id/:channelMotor' component={Checkout} />
                            <Route exact path='/:subchannel/checkout/:product/:id/:idGetPoints/:sellPoints/:channelMotor' component={Checkout} />
                            <Route exact path='/thankscontact/:id' component={ThanksContact} />
                            
                            <Route exact path='/*' component={ErrorPage} />
                        </Switch>
                    </main>
                    <Footer />
                    </div>
                )} />
            </Switch>
        )
    }
}

export default Main;