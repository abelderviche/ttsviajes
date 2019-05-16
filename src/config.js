const env = process.env.REACT_APP_ENV || 'local';

// const LOCAL_API = process.env.REACT_APP_LOCAL_API || 'http://localhost:3001';
const DEV_API = process.env.REACT_APP_DEV_API || 'http://localhost:3001';

const SUBCHANNEL = window.location.pathname.split('/')[1]==='checkout'?'tts':window.location.pathname.split('/')[1]==='thanks'?'tts':window.location.pathname.split('/')[1];
//let SUBCHANNEL = 'tts';
//let APTEK_BASE = 'http://apteknet.com';
//let APTEK_HOTELS = 'https://www.ttsviajes.com/hoteles/resultados';
//let APTEK_CARS = 'https://www.ttsviajes.com/autos/resultados';
let TTS_BASE = 'https://www.ttsviajes.com';
let TTS_WEBSERVICES = 'https://servicios.ttsviajes.com';
let TTS_CHECKOUT_WEBSERVICES = 'https://servicios2ext.ttsviajes.com:9001';
let TTS_CHECKOUT_WEBSERVICES_HOTEL = 'https://servicios2ext.ttsviajes.com:7701';
let TTS_CDN_BASE = 'https://cdn.ttsviajes.com';
let TTS_ALT = 'https://www.ttsviajes.com';
let BASSET = 'https://api.basset.ws';
let BASSET_FLIGHTS = 'https://search.ttsviajes.com';
let TTS_SERVICES  = 'https://servicios.ttsviajes.com:8300';
let CORPORATE_URL = 'http://corporate.ttsviajes.com/'
let EVENTOS_URL   = 'http://eventos.ttsviajes.com/';
let CASAMIENTOS_URL   = 'https://w3.ttsviajes.com/casamientos';
let TRABAJA_URL    = 'https://w3.ttsviajes.com/trabaja_con_nosotros';
let TTS_CROSSSELING_PRODS = "https://servicios.ttsviajes.com:5500";
let SEND_EMAIL = "https://www.ttsviajes.com/api/Paymentsemail";
let  TTS_CHECKOUT_SHOPPING = "";

switch(env) {
  case 'local': 
    //SUBCHANNEL = 'tts'; 
    //APTEK_BASE = DEV_API;
    TTS_BASE = 'https://www.qa.ttsviajes.com';//DEV_API;
    TTS_WEBSERVICES = 'https://servicios.qa.ttsviajes.com:11000';
    
    //TTS_CHECKOUT_WEBSERVICES = 'https://servicios.qa.ttsviajes.com:9001';//'http://servicios.qattsviajes.com:9001';
    TTS_CHECKOUT_WEBSERVICES = DEV_API;//'http://servicios.qattsviajes.com:9001';
    TTS_CHECKOUT_WEBSERVICES_HOTEL = DEV_API;//'http://servicios.qattsviajes.com:9001';
    TTS_CDN_BASE = 'http://cdn.devttsviajes.com/';//DEV_API;
    BASSET = 'https://api.basset.ws';
    BASSET_FLIGHTS = 'https://search.ttsviajes.com';//https://dev.tts-viajes.basset.la';
    TTS_SERVICES = "https://servicios.dev.ttsviajes.com:8300";
    CORPORATE_URL = 'http://dev.corporate.ttsviajes.com/'; 
    EVENTOS_URL   = 'http://dev.eventos.ttsviajes.com/';
    CASAMIENTOS_URL   = 'http://dev.w3.ttsviajes.com/casamientos';
    TRABAJA_URL    = 'http://dev.w3.ttsviajes.com/trabaja_con_nosotros';
    TTS_ALT = 'https://www.qattsviajes.com';
    TTS_CROSSSELING_PRODS = DEV_API;
    SEND_EMAIL = "https://dev.ttsviajes.com/api/Paymentsemail";
    TTS_CHECKOUT_SHOPPING = DEV_API;
    break;
  case 'dev':
    //SUBCHANNEL = 'redapp';
    //APTEK_BASE = DEV_API;
    TTS_BASE = 'https://www.qattsviajes.com';//DEV_API;
    TTS_WEBSERVICES = 'https://servicios.dev.ttsviajes.com:11000';
    TTS_CHECKOUT_WEBSERVICES = 'https://serviciospayment.dev.ttsviajes.com/ConcentradorAereos';//'http://servicios.qattsviajes.com:9001';
    TTS_CHECKOUT_WEBSERVICES_HOTEL = 'https://serviciospayment.dev.ttsviajes.com/CMP';
    TTS_CDN_BASE = 'http://cdn.devttsviajes.com/';//DEV_API;
    BASSET = 'https://api.basset.ws';
    BASSET_FLIGHTS = 'https://search.ttsviajes.com';//https://dev.tts-viajes.basset.la';
    TTS_SERVICES = "https://servicios.dev.ttsviajes.com:8300";
    CORPORATE_URL = 'http://dev.corporate.ttsviajes.com/'; 
    EVENTOS_URL   = 'http://dev.eventos.ttsviajes.com/';
    CASAMIENTOS_URL   = 'http://dev.w3.ttsviajes.com/casamientos';
    TRABAJA_URL    = 'http://dev.w3.ttsviajes.com/trabaja_con_nosotros';
    TTS_CROSSSELING_PRODS = "https://servicios.dev.ttsviajes.com:5500";
    SEND_EMAIL = "https://dev.ttsviajes.com/api/Paymentsemail";
    break;
  case 'test':
    //SUBCHANNEL = 'tts';
    //APTEK_BASE = DEV_API;
    TTS_BASE = 'https://www.qattsviajes.com';
    TTS_WEBSERVICES = 'https://servicios.qa.ttsviajes.com:11000';
    TTS_CHECKOUT_WEBSERVICES = 'https://serviciospayment.qa.ttsviajes.com/ConcentradorAereos';//'http://servicios.qattsviajes.com:9001';
    TTS_CHECKOUT_WEBSERVICES_HOTEL = 'https://serviciospayment.qa.ttsviajes.com/CMP';
    TTS_CDN_BASE = 'https://cdn.qattsviajes.com/';
    BASSET = 'https://api.basset.ws';//'https://dev.api.basset.ws';
    BASSET_FLIGHTS = 'https://search.ttsviajes.com';//'https://dev.tts-viajes.basset.la';
    TTS_SERVICES = "https://servicios.qa.ttsviajes.com:8300";
    CORPORATE_URL = 'http://corporate.qattsviajes.com/'; 
    EVENTOS_URL   = 'http://eventos.qattsviajes.com/';
    CASAMIENTOS_URL   = 'https://w3.qattsviajes.com/casamientos';
    TRABAJA_URL    = 'https://w3.qattsviajes.com/trabaja_con_nosotros';
    TTS_ALT = 'https://www.qattsviajes.com';
    TTS_CROSSSELING_PRODS = "https://servicios.qa.ttsviajes.com:5500";
    SEND_EMAIL = "https://www.qa.ttsviajes.com/api/Paymentsemail";
    break;
  case 'prod':
    //SUBCHANNEL = 'tts';
    TTS_WEBSERVICES = 'https://servicios2ext.ttsviajes.com:11000';
    TTS_CHECKOUT_WEBSERVICES = 'https://serviciospayment.ttsviajes.com/ConcentradorAereos';
    TTS_CHECKOUT_WEBSERVICES_HOTEL = 'https://serviciospayment.ttsviajes.com/CMP';
    BASSET = 'https://api.basset.ws';
    BASSET_FLIGHTS = 'https://search.ttsviajes.com';
    TTS_SERVICES = "https://servicios.ttsviajes.com:8300";//"https://servicios.qa.ttsviajes.com:8300";
    TTS_CROSSSELING_PRODS = "https://servicios.ttsviajes.com:5500";
    SEND_EMAIL = "https://www.ttsviajes.com/api/Paymentsemail";
    break;
  default:
    break;
}

const ENV = {
  EMAIL: {
     ENDPOINT:`${SEND_EMAIL}`,
     REQUEST_HEADERS: {
      'channel': 'site',
      'subchannel': 'tts',
      'consumer': 'api',
      'content-type':'json'
    }
  },
  SUBCHANNEL: SUBCHANNEL,
  BASSET: {
    API_KEY: process.env['REACT_APP_BASSET_API_KEY_'+SUBCHANNEL.toUpperCase()],
    CLIENT_ID: process.env['REACT_APP_BASSET_CLIENT_'+SUBCHANNEL.toUpperCase()]
  },
  CONFIGURATION: TTS_BASE + '/json/tts/site/search.json',
  CDN: `https://cdn.ttsviajes.com/json`,
  PARTNERSHIPS: `${TTS_WEBSERVICES}/api/alianzas/tts`,
  ADS: `${TTS_WEBSERVICES}/api/Advertising`,
  PROMOTIONS: `${TTS_WEBSERVICES}/api/financiacion/modulo`,
  CROSSSELING_PRODS: TTS_CROSSSELING_PRODS + '/api/crosssellingproducts/assistcard',
  PACKAGES: {
    DESTINATIONS: TTS_CDN_BASE + '/json/paquetes_origenes_destinos.json',
    DATES: (origin, destination) => `${TTS_CDN_BASE}/buscadores/paquetes/getDates/destino/${origin},${destination}`
  },
  URLS:{
    CORPORATE: CORPORATE_URL,
    EVENTOS:  EVENTOS_URL,
    CASAMIENTOS:  CASAMIENTOS_URL,
    TRABAJA: TRABAJA_URL,
    GETHEADER: `${TTS_BASE}/header/${SUBCHANNEL==='turismocity'?'tts':SUBCHANNEL}/hide`
  },
  CHECKOUT: {
    GETINFO:TTS_CHECKOUT_SHOPPING + '/getinfo',
    PM_FALLBACK: TTS_ALT + '/api/smr',
    PAYMENT_METHODS: TTS_CHECKOUT_WEBSERVICES + '/api/Aereos/checkoutSupportBasset/',
    PAYMENT_METHODS_HOTEL: TTS_CHECKOUT_WEBSERVICES_HOTEL + '/api/chas/checkoutSupportBasset/',
    COLLECT: TTS_CHECKOUT_WEBSERVICES + '/api/Aereos/Collect',
    COLLECT_HOTEL: TTS_CHECKOUT_WEBSERVICES_HOTEL + '/api/chas/collect',
    RETRIEVE_RESERVATION: BASSET + '/reservations/{id}?site=AR&channel=WEB',
    RETRIEVE_RESERVATION_PRODUCT: BASSET + '/flights/reservations/{id}?site=AR&channel=WEB',
    RETRIEVE_RESERVATION_PRODUCT_HOTEL: BASSET + '/accommodations/reservations/{id}?site=AR&channel=WEB',
    STATES: TTS_WEBSERVICES + '/api/getProvincias',
    CITIES: TTS_WEBSERVICES + '/api/getCiudades/{id}',
    FISCAL_SITUATIONS: TTS_WEBSERVICES + '/api/getSituacionFiscal',
    DOCUMENT_TYPES: TTS_WEBSERVICES + '/api/getTiposDocumentos',
    THANKS: BASSET_FLIGHTS + '/checkout/reservations/{id}/thanks',
    REQUEST_HEADERS: {
      'channel': 'site',
      'subchannel': SUBCHANNEL,
      'consumer': 'api',
      'app': 'onlinebasset',
      'source': 'online',
      'sourcegds': 'sabre'
    }
  }
};
module.exports = ENV;