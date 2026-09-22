import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as Localization from 'expo-localization';

import translationsAz from './locales/az/translations.json';
import translationsEn from './locales/en/translations.json';

const resources = {
  en: { translation: translationsEn },
  az: { translation: translationsAz },
};

const languageCode = Localization.getLocales()[0].languageCode || 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: languageCode.split('-')[0],
  fallbackLng: 'en',
  resources,
});

export default i18n;
