import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist';

import esES from '../language/i18n/es';
import enUS from '../language/i18n/en';

class LanguageStore {
  @persist @observable language = 'es';

  @computed get currentLanguage() {
    return this.language;
  }
  @computed get resource() {
    switch (this.language) {
      case 'en':
        return enUS;
      case 'es':
        return esES;
      default:
        return esES;
    }
  }

  @action changeLanguageTo = (language) => {
    this.language = language;
  }

  getText = (key) => {
    if (!key) return '';
    return key.indexOf('.') !== -1 ? this.resource[key.split('.')[0]][key.split('.')[1]] : this.resource[key];
  }
}

export default new LanguageStore();
