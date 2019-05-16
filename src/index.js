import 'babel-polyfill';
import ReactGA from 'react-ga';
import React from 'react';
import moment from 'moment';
import { render } from 'react-dom';
import { Router, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import createBrowserHistory from 'history/createBrowserHistory';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

// Service Worker for PWA
import serviceWorkerRegister from 'registerServiceWorker';
// Import our Stores Here
import { create } from 'mobx-persist';

import LanguageStore from 'stores/language';
import PaymentMethodStore from 'stores/payment-method';
import BillingStore from 'stores/billing';
import AssistCardStore from 'stores/assist-card';
import CheckoutFormStore from 'stores/checkout-form';
import ReservationsStore from 'stores/reservations';
import ApplicationStore from 'stores/application';
import CheckoutStore from 'stores/checkout';

// Import Components
import "assets/css/main.css";
import Main from './containers/main';

moment.locale('es', {
  months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
  monthsShort : 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  monthsParseExact : true,
  weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort : 'Dom_Lun_Mar_Mié_Jue_Vie_Sab'.split('_'),
  weekdaysMin : 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
  weekdaysParseExact : true,
  longDateFormat : {
    LLLL : 'ddd[.] D MMM[.] YYYY'
  }
});

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);

// Execute the ServiceWorker
serviceWorkerRegister();

const hydrate = create();

const store = {
  language: LanguageStore,
  routing: routingStore,
  paymentMethod: PaymentMethodStore,
  billing: BillingStore,
  assistcard:AssistCardStore,
  checkoutForm: CheckoutFormStore,
  reservations: ReservationsStore,
  application: ApplicationStore,
  checkout:CheckoutStore
};

hydrate('LanguageStore', store.language);
hydrate('ApplicationStore', store.application);


const router = (
  <Provider {...store}>
    <Router history={history}>
      <Route exact path='/*' component={Main}/>
    </Router>
  </Provider>
);

render(router, document.getElementById('root'));
