import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import moment from 'moment';

import ApiClient from './api-client';
import ENV from 'config';

class ProductConfiguration {
  @persist @observable anticipationDays;
  @persist @observable maxSearchMonths;
  @persist @observable maxDays;

  constructor(anticipationDays, maxSearchMonths, maxDays) {
    this.anticipationDays = anticipationDays;
    this.maxSearchMonths = maxSearchMonths;
    this.maxDays = maxDays;
  }
}

class ApplicationStore {
  @persist('object', ProductConfiguration) @observable hotels;
  @persist('object', ProductConfiguration) @observable flights;
  @persist('object', ProductConfiguration) @observable cars;
  @persist('object', ProductConfiguration) @observable packages;
  @persist('list') @observable partnerships = [];
  @persist('list') @observable ads = [];
  @persist('list') @observable promotions = [];
  @persist('object') @observable highlightedPromo = {};

  @action load = () => {
    this.loadProductsConfiguration();
    this.loadPartnerships();
    this.loadPaymentPromotions();
    this.loadAds();
  }

  loadProductsConfiguration = () => {
    ApiClient.get(ENV.CONFIGURATION)
      .then(res => {
        this.hotels = this._buildProductConfiguration(res.data.data.find((product) => product.name === 'Hoteles'));
        this.flights = this._buildProductConfiguration(res.data.data.find((product) => product.name === 'Vuelos'));
        this.cars = this._buildProductConfiguration(res.data.data.find((product) => product.name === 'Autos'));
        this.packages = this._buildProductConfiguration(res.data.data.find((product) => product.name === 'Paquetes'));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  loadPartnerships = () => {
    ApiClient.get(ENV.PARTNERSHIPS)
      .then(res =>{
        const { data } = res.data;
        this.partnerships = data;
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  loadAds = () => {
    ApiClient.post(ENV.ADS, {
      "sub_channel": "TTS",
      "type":"PUBLICITIES"
    }).then(res =>{
      if (res.data) {
        const { data } = res.data;
        const { images } = data.advertising.definition;
        this.ads = images;
      }
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  loadPaymentPromotions = () => {
    ApiClient.get(ENV.PROMOTIONS).then(res =>{
      if (res.data) {
        const { data } = res.data.data;
        this.promotions = [];
        data.forEach(promo => {
          const promoObj = {
            img: promo.imagenes[0].filename,
            alt: promo.imagenes[0].title,
            maxInstallments: promo.max_dues,
            name: promo.title
          };
          if (promo.entity_highlight === 1) {
            this.highlightedPromo = promoObj;
          } else {
            this.promotions.push(promoObj);
          }
        })
      }
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  minDate(product) {
    if (this[product]) return moment().add(this[product].anticipationDays, 'days');
    return moment();
  }

  maxDate(product) {
    if (this[product]) return moment().add(this[product].maxSearchMonths, 'months');
    return moment();
  }

  maxRange(product, startDate) {
    return startDate.add(this[product].maxDays, 'days');
  }

  _buildProductConfiguration(config) {
    return new ProductConfiguration(config.anticipation_from_min_days, config.max_search_months, config.anticipation_to_max_days);
  }
}

export default new ApplicationStore();
