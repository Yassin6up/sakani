// i18n.js
import 'intl-pluralrules'; // Apply the polyfill first
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';
import translationEN from './translate/en.json';
import translationAR from './translate/ar.json';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (cb) => {
    const locale =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;
    cb(locale ? locale.split('_')[0] : 'ar');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',
    lng: 'ar', // Default language
    resources: {
      en: { translation: translationEN },
      ar: { translation: translationAR },
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
